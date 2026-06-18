import puppeteer from 'puppeteer';
import SiteSettings from '../models/SiteSettings.js';

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 5;

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

async function getStoredCookies() {
  const settings = await SiteSettings.findOne();
  if (!settings?.igCookies) return null;
  if (settings.igCookiesAt && Date.now() - settings.igCookiesAt.getTime() > COOKIE_MAX_AGE) return null;
  try { return JSON.parse(settings.igCookies); } catch { return null; }
}

async function saveCookies(cookies) {
  await SiteSettings.findOneAndUpdate({}, { igCookies: JSON.stringify(cookies), igCookiesAt: new Date() });
}

async function tryLogin(page, emit) {
  const settings = await SiteSettings.findOne();
  if (!settings?.igAuditUser || !settings?.igAuditPass) return false;

  emit('log', 'Authenticating...');
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await page.click('[role="dialog"] button').catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  // Instagram uses 'username' or 'email' + 'password' or 'pass'
  const user = await page.$('input[name="username"]') || await page.$('input[name="email"]');
  const pass = await page.$('input[name="password"]') || await page.$('input[name="pass"]');
  if (!user || !pass) { emit('log', 'Login form not found'); return false; }

  await user.click({ clickCount: 3 });
  await user.type(settings.igAuditUser, { delay: 60 });
  await pass.click({ clickCount: 3 });
  await pass.type(settings.igAuditPass, { delay: 60 });

  // Press Enter to submit (click fails  - button often obscured by overlays)
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 5000));

  // Check if still on login
  const stillLogin = await page.$('input[name="username"]') || await page.$('input[name="email"]');
  if (stillLogin) { emit('log', 'Login failed  - check credentials or challenge'); return false; }

  // Dismiss "Save Login Info" / "Turn on Notifications" dialogs
  for (let d = 0; d < 3; d++) {
    const notNow = await page.evaluateHandle(() => {
      const btns = [...document.querySelectorAll('button')];
      return btns.find(b => /not now/i.test(b.textContent)) || null;
    });
    if (notNow && notNow.asElement()) {
      await notNow.asElement().click().catch(() => {});
      await new Promise(r => setTimeout(r, 1500));
    } else break;
  }

  const cookies = await page.cookies();
  await saveCookies(cookies);
  emit('log', 'Session saved');
  return true;
}

export async function scrapeInstagram(handle, emit = () => {}, opts = {}) {
  const url = `https://www.instagram.com/${handle}/`;
  let browser;

  try {
    emit('log', 'Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // Intercept API responses for precise numbers
    let apiUserData = null;
    page.on('response', async (response) => {
      try {
        const u = response.url();
        if (response.status() !== 200) return;
        if (u.includes('/api/v1/users/') || u.includes('graphql/query')) {
          const text = await response.text();
          const json = JSON.parse(text);
          const user = json?.user || json?.data?.user;
          if (user && (user.follower_count || user.edge_followed_by)) {
            apiUserData = {
              followers: user.follower_count || user.edge_followed_by?.count,
              following: user.following_count || user.edge_follow?.count,
              postCount: user.media_count || user.edge_owner_to_timeline_media?.count,
              bio: user.biography,
              name: user.full_name,
              handle: user.username,
              profilePic: user.profile_pic_url_hd || user.profile_pic_url,
              isVerified: user.is_verified,
            };
          }
        }
      } catch {}
    });

    // Try stored cookies first
    const cookies = await getStoredCookies();
    let loggedIn = false;

    if (cookies) {
      emit('log', 'Restoring session...');
      await page.setCookie(...cookies);
      loggedIn = true;
    }

    // If no cookies, always login first (post grid needs auth)
    if (!loggedIn) {
      emit('log', 'No session  - logging in first...');
      const ok = await tryLogin(page, emit);
      if (ok) loggedIn = true;
    }

    emit('log', `Loading instagram.com/${handle}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise(r => setTimeout(r, 3000));

    // Check if redirected to login (cookies expired)
    const cur = page.url();
    if (cur.includes('/accounts/login') || cur.includes('/challenge')) {
      emit('log', 'Session expired  - re-authenticating...');
      const ok = await tryLogin(page, emit);
      if (ok) {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    await page.waitForSelector('header', { timeout: 8000 }).catch(() => {});

    // Extract profile data
    emit('log', 'Extracting profile...');
    const data = await page.evaluate(() => {
      const r = { handle: '', name: '', bio: '', followers: 0, following: 0, postCount: 0, profilePic: '', isVerified: false };
      function pc(s) { if (!s) return 0; s = String(s).replace(/,/g, ''); const l = s.toLowerCase(); if (l.endsWith('k')) return Math.round(parseFloat(l)*1000); if (l.endsWith('m')) return Math.round(parseFloat(l)*1000000); return parseInt(s,10)||0; }

      // Method 1: OG meta tags
      const og = document.querySelector('meta[property="og:description"]')?.content || '';
      const m = og.match(/([\d,.KMkm]+)\s*Followers.*?([\d,.KMkm]+)\s*Following.*?([\d,.KMkm]+)\s*Posts/i);
      if (m) { r.followers = pc(m[1]); r.following = pc(m[2]); r.postCount = pc(m[3]); }

      // Method 2: header spans with title attribute (exact numbers)
      const header = document.querySelector('header');
      if (header) {
        for (const el of header.querySelectorAll('span[title], a span')) {
          const title = el.getAttribute('title');
          if (title && /[\d,]+/.test(title)) {
            const container = el.closest('li') || el.closest('a') || el.parentElement;
            const txt = (container?.textContent || '').toLowerCase();
            const val = pc(title);
            if (txt.includes('follower') && !txt.includes('following') && val) r.followers = val;
            else if (txt.includes('following') && val) r.following = val;
            else if (txt.includes('post') && val) r.postCount = val;
          }
        }
      }

      // Bio & name from OG
      r.bio = og.split(' - ').slice(1).join(' - ').trim().slice(0, 300);
      r.profilePic = document.querySelector('meta[property="og:image"]')?.content || '';
      const t = document.querySelector('meta[property="og:title"]')?.content || '';
      r.name = t.split('(')[0]?.trim() || '';
      r.handle = t.match(/@(\w+)/)?.[1] || '';
      return r;
    });

    // Override with API-intercepted data (most precise)
    if (apiUserData) {
      if (apiUserData.followers) data.followers = apiUserData.followers;
      if (apiUserData.following) data.following = apiUserData.following;
      if (apiUserData.postCount) data.postCount = apiUserData.postCount;
      if (apiUserData.bio) data.bio = apiUserData.bio;
      if (apiUserData.name) data.name = apiUserData.name;
      if (apiUserData.handle) data.handle = apiUserData.handle;
      if (apiUserData.profilePic) data.profilePic = apiUserData.profilePic;
      if (apiUserData.isVerified) data.isVerified = apiUserData.isVerified;
      emit('log', 'Got precise data from API');
    }

    // Download profile pic as base64 (avoids CORS on frontend)
    if (data.profilePic) {
      emit('log', 'Downloading profile image...');
      const base64Pic = await page.evaluate(async (picUrl) => {
        try {
          const res = await fetch(picUrl);
          const blob = await res.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch { return null; }
      }, data.profilePic).catch(() => null);
      if (base64Pic) data.profilePicBase64 = base64Pic;
    }

    if (data.followers) emit('data', { type: 'followers', value: fmtNum(data.followers) });
    if (data.following) emit('data', { type: 'following', value: fmtNum(data.following) });
    if (data.postCount) emit('data', { type: 'posts', value: data.postCount });
    if (data.bio) emit('data', { type: 'bio', value: data.bio.slice(0, 80) });

    // Detect private profile
    const isPrivate = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('this account is private') || text.includes('private account');
    });

    // Collect post links (max 6, skip pinned posts)
    emit('log', 'Finding recent posts...');
    const postLinks = await page.evaluate(() => {
      const links = []; const seen = new Set();
      document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]').forEach(a => {
        // Skip pinned posts (have pin icon in parent container)
        const cell = a.closest('div') || a.parentElement;
        const isPinned = cell?.querySelector('[aria-label*="Pin"]') ||
                         cell?.querySelector('[aria-label*="pin"]') ||
                         cell?.innerHTML?.includes('Pinned');
        if (isPinned) return;
        const h = a.href.split('?')[0];
        if (!seen.has(h) && links.length < 6) { seen.add(h); links.push(h); }
      });
      return links;
    }).catch(() => []);

    if (isPrivate || (postLinks.length === 0 && data.postCount > 0)) {
      data.isPrivate = true;
      emit('log', 'Profile is private');
    }

    emit('data', { type: 'postsFound', value: postLinks.length });

    // Deep scan each post
    const posts = [];
    const allHashtags = {};

    for (let i = 0; i < postLinks.length; i++) {
      const postUrl = postLinks[i];
      const isReel = postUrl.includes('/reel/');
      emit('log', `Post ${i+1}/${postLinks.length}${isReel ? ' (Reel)' : ''}...`);

      try {
        await page.goto(postUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));

        const pd = await page.evaluate(() => {
          const r = { likes: 0, comments: 0, views: 0, date: '', caption: '', type: 'image', hashtags: [] };
          if (window.location.href.includes('/reel/')) r.type = 'reel';
          else if (document.querySelector('video')) r.type = 'video';

          function pc(s) { if (!s) return 0; s = String(s).replace(/,/g,''); const l = s.toLowerCase(); if (l.endsWith('k')) return Math.round(parseFloat(l)*1000); if (l.endsWith('m')) return Math.round(parseFloat(l)*1000000); return parseInt(s,10)||0; }

          // 1. Meta description (most reliable for exact numbers)
          const meta = document.querySelector('meta[name="description"]')?.content || '';
          const likeMeta = meta.match(/([\d,]+)\s*likes?/i);
          const commentMeta = meta.match(/([\d,]+)\s*comments?/i);
          if (likeMeta) r.likes = pc(likeMeta[1]);
          if (commentMeta) r.comments = pc(commentMeta[1]);

          // 2. LD+JSON structured data
          for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
            try {
              const ld = JSON.parse(s.textContent);
              if (ld.interactionStatistic) {
                for (const stat of [].concat(ld.interactionStatistic)) {
                  if (/like/i.test(stat.interactionType) && !r.likes) r.likes = stat.userInteractionCount || 0;
                  if (/comment/i.test(stat.interactionType) && !r.comments) r.comments = stat.userInteractionCount || 0;
                }
              }
              if (ld.commentCount && !r.comments) r.comments = ld.commentCount;
            } catch {}
          }

          // 3. Fallback: visible spans for likes
          if (!r.likes) {
            for (const s of document.querySelectorAll('span')) {
              const t = s.textContent.trim();
              const lm = t.match(/^([\d,.KMkm]+)\s*(likes?|others?)/i);
              if (lm) { r.likes = pc(lm[1]); break; }
            }
          }

          // 4. Views for reels/videos
          for (const s of document.querySelectorAll('span')) {
            const t = s.textContent.trim();
            const vm = t.match(/^([\d,.KMkm]+)\s*(views?|plays?)/i);
            if (vm) { r.views = pc(vm[1]); break; }
          }

          // Date
          const timeEl = document.querySelector('time[datetime]');
          r.date = timeEl?.getAttribute('datetime') || '';

          // Caption
          const h1 = document.querySelector('h1');
          const captionText = h1?.textContent?.trim() || '';
          r.caption = captionText.slice(0, 300);

          // Hashtags
          const tagMatches = captionText.match(/#\w+/g) || [];
          r.hashtags = tagMatches.map(t => t.slice(1).toLowerCase());

          r.thumbnail = document.querySelector('meta[property="og:image"]')?.content || '';
          return r;
        });

        pd.url = postUrl;
        pd.index = i + 1;
        pd.dateFormatted = pd.date ? new Date(pd.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

        // Engagement rate per post
        if (data.followers > 0) {
          pd.engRate = ((pd.likes + pd.comments) / data.followers * 100).toFixed(2);
        }

        posts.push(pd);

        // Track hashtags
        for (const tag of pd.hashtags) {
          allHashtags[tag] = (allHashtags[tag] || 0) + 1;
        }

        const metrics = [];
        if (pd.views) metrics.push(`${fmtNum(pd.views)} views`);
        metrics.push(`${fmtNum(pd.likes)} likes`);
        if (pd.comments) metrics.push(`${fmtNum(pd.comments)} comments`);

        emit('data', { type: `post_${i+1}`, value: `${pd.type} | ${pd.dateFormatted || '?'} | ${metrics.join(', ')}` });
        emit('log', `Post ${i+1}: ${pd.type} (${pd.dateFormatted || '?'})  - ${metrics.join(', ')}`);
      } catch (e) {
        emit('log', `Post ${i+1}: failed  - ${e.message}`);
      }
    }

    // Save fresh cookies
    const fresh = await page.cookies();
    if (fresh.length > 3) await saveCookies(fresh);

    // Calculate engagement summary
    const validPosts = posts.filter(p => p.likes > 0 || p.views > 0);
    const engagement = {};
    if (validPosts.length) {
      const tLikes = validPosts.reduce((s, p) => s + p.likes, 0);
      const tComments = validPosts.reduce((s, p) => s + p.comments, 0);
      const tViews = validPosts.reduce((s, p) => s + p.views, 0);
      const viewPosts = validPosts.filter(p => p.views > 0);
      const reels = validPosts.filter(p => p.type === 'reel').length;

      engagement.avgLikes = Math.round(tLikes / validPosts.length);
      engagement.avgComments = Math.round(tComments / validPosts.length);
      engagement.avgViews = viewPosts.length ? Math.round(tViews / viewPosts.length) : 0;
      engagement.engagementRate = data.followers > 0 ? ((tLikes + tComments) / validPosts.length / data.followers * 100).toFixed(3) : 'N/A';
      engagement.reelRatio = `${reels}/${validPosts.length}`;

      emit('data', { type: 'engRate', value: engagement.engagementRate + '%' });
      emit('data', { type: 'avgLikes', value: fmtNum(engagement.avgLikes) });
      if (engagement.avgViews) emit('data', { type: 'avgViews', value: fmtNum(engagement.avgViews) });
      emit('data', { type: 'reelRatio', value: engagement.reelRatio });
      emit('log', `Engagement: ${engagement.engagementRate}% | Avg likes: ${fmtNum(engagement.avgLikes)}`);

      // Posting frequency
      const dates = validPosts.map(p => p.date).filter(Boolean).map(d => new Date(d)).sort((a, b) => b - a);
      if (dates.length >= 2) {
        const daySpan = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24) || 1;
        engagement.postsPerWeek = (dates.length / daySpan * 7).toFixed(1);
        emit('data', { type: 'postsPerWeek', value: engagement.postsPerWeek });
        emit('log', `~${engagement.postsPerWeek} posts/week over ${Math.round(daySpan)} days`);
      }

      // Posting hours
      const hours = {};
      const weekdays = {};
      dates.forEach(d => {
        hours[d.getUTCHours()] = (hours[d.getUTCHours()] || 0) + 1;
        const day = d.toLocaleDateString('en', { weekday: 'long' });
        weekdays[day] = (weekdays[day] || 0) + 1;
      });
      const bestHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0];
      const bestDay = Object.entries(weekdays).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (bestHour) {
        engagement.bestHour = bestHour;
        engagement.bestDay = bestDay;
        emit('data', { type: 'bestTime', value: `${bestHour}:00 UTC ${bestDay || ''}` });
      }
    }

    // Hashtag summary
    const topHashtags = Object.entries(allHashtags).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const hashtagData = {
      topUsed: topHashtags.map(([tag, count]) => ({ tag, count })),
      uniqueCount: Object.keys(allHashtags).length,
      avgPerPost: validPosts.length ? (Object.values(allHashtags).reduce((a, b) => a + b, 0) / validPosts.length).toFixed(1) : 0,
    };
    if (topHashtags.length) {
      emit('data', { type: 'topHashtags', value: topHashtags.slice(0, 5).map(([t]) => '#' + t).join(', ') });
      emit('log', `${hashtagData.uniqueCount} unique hashtags, avg ${hashtagData.avgPerPost}/post`);
    }

    data.posts = posts;
    data.engagement = engagement;
    data.hashtags = hashtagData;
    data.platform = 'Instagram';
    data.url = url;
    data.scraped = data.followers > 0 || posts.length > 0 || data.bio.length > 0;

    emit('log', data.scraped ? `Done  - ${posts.length} posts analyzed` : 'Limited data  - profile may be private');
    return data;
  } catch (err) {
    emit('log', `Error: ${err.message}`);
    return { platform: 'Instagram', handle, scraped: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

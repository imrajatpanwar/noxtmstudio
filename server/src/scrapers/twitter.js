import puppeteer from 'puppeteer';

export async function scrapeTwitter(handle, emit = () => {}) {
  const url = `https://x.com/${handle}`;
  let browser;

  try {
    emit('log', 'Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

    emit('log', `Navigating to x.com/${handle}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await page.waitForSelector('[data-testid="UserName"], [data-testid="UserDescription"]', { timeout: 10000 }).catch(() => {});

    emit('log', 'Extracting profile data...');
    const data = await page.evaluate(() => {
      const result = { handle: '', name: '', bio: '', followers: 0, following: 0, tweets: 0, verified: false, profilePic: '' };

      const nameEl = document.querySelector('[data-testid="UserName"]');
      if (nameEl) {
        const spans = nameEl.querySelectorAll('span');
        result.name = spans[0]?.textContent?.trim() || '';
        result.handle = nameEl.querySelector('a[href*="/"]')?.textContent?.trim() || '';
      }

      const bioEl = document.querySelector('[data-testid="UserDescription"]');
      result.bio = bioEl?.textContent?.trim()?.slice(0, 300) || '';

      const links = document.querySelectorAll('a[href*="/followers"], a[href*="/following"], a[href*="/verified_followers"]');
      links.forEach(link => {
        const text = link.textContent.trim();
        const num = parseCount(text.split(' ')[0]);
        if (link.href.includes('/following')) result.following = num;
        else if (link.href.includes('/followers') || link.href.includes('/verified_followers')) result.followers = num;
      });

      result.verified = !!document.querySelector('[data-testid="icon-verified"]');
      result.profilePic = document.querySelector('img[alt*="Opens profile photo"]')?.src || '';

      function parseCount(str) {
        if (!str) return 0;
        str = str.replace(/,/g, '');
        const lower = str.toLowerCase();
        if (lower.endsWith('k')) return Math.round(parseFloat(lower) * 1000);
        if (lower.endsWith('m')) return Math.round(parseFloat(lower) * 1000000);
        return parseInt(str, 10) || 0;
      }

      return result;
    });

    if (data.followers) emit('data', { type: 'followers', value: data.followers });
    if (data.following) emit('data', { type: 'following', value: data.following });
    if (data.bio) emit('data', { type: 'bio', value: data.bio });
    if (data.verified) emit('data', { type: 'verified', value: true });

    emit('log', 'Scanning recent tweets...');
    const recentTweets = await page.evaluate(() => {
      const tweets = [];
      const tweetEls = document.querySelectorAll('[data-testid="tweet"]');
      tweetEls.forEach((el, i) => {
        if (i >= 10) return;
        const text = el.querySelector('[data-testid="tweetText"]')?.textContent?.trim() || '';
        const time = el.querySelector('time')?.getAttribute('datetime') || '';
        const likes = el.querySelector('[data-testid="like"]')?.getAttribute('aria-label') || '';
        const retweets = el.querySelector('[data-testid="retweet"]')?.getAttribute('aria-label') || '';
        tweets.push({ text: text.slice(0, 200), time, likes, retweets });
      });
      return tweets;
    }).catch(() => []);

    if (recentTweets.length) {
      emit('data', { type: 'recentTweets', value: `${recentTweets.length} tweets found` });
      emit('log', `Found ${recentTweets.length} recent tweets`);
    }

    data.recentTweets = recentTweets;
    data.platform = 'Twitter/X';
    data.url = url;
    data.scraped = data.followers > 0 || data.bio.length > 0;

    emit('log', data.scraped ? 'Profile data extracted' : 'Limited data — may require login');
    return data;
  } catch (err) {
    emit('log', `Scrape error: ${err.message}`);
    return { platform: 'Twitter/X', handle, scraped: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

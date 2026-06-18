import puppeteer from 'puppeteer';

export async function scrapeWebsite(inputUrl, emit = () => {}) {
  let url = inputUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
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

    emit('log', `Loading ${url}...`);
    const startTime = Date.now();
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    const loadTimeMs = Date.now() - startTime;
    emit('data', { type: 'loadTime', value: `${loadTimeMs}ms` });
    emit('log', `Page loaded in ${loadTimeMs}ms`);

    emit('log', 'Analyzing page structure...');
    const data = await page.evaluate(() => {
      const result = {
        title: '', metaDescription: '', h1: [], h2: [], imageCount: 0, linkCount: 0,
        socialLinks: [], hasBlog: false, hasContactForm: false, wordCount: 0, ctaButtons: [], ogImage: '', favicon: '',
      };

      result.title = document.title || '';
      result.metaDescription = document.querySelector('meta[name="description"]')?.content || '';
      result.ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
      result.favicon = document.querySelector('link[rel*="icon"]')?.href || '';

      document.querySelectorAll('h1').forEach(h => { if (h.textContent.trim()) result.h1.push(h.textContent.trim().slice(0, 100)); });
      document.querySelectorAll('h2').forEach((h, i) => { if (i < 6 && h.textContent.trim()) result.h2.push(h.textContent.trim().slice(0, 100)); });

      result.imageCount = document.querySelectorAll('img').length;
      result.linkCount = document.querySelectorAll('a[href]').length;

      const bodyText = document.body?.innerText || '';
      result.wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

      const socialDomains = ['instagram.com', 'twitter.com', 'x.com', 'linkedin.com', 'facebook.com', 'youtube.com', 'tiktok.com'];
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.href.toLowerCase();
        socialDomains.forEach(d => {
          if (href.includes(d) && !result.socialLinks.find(s => s.includes(d))) {
            result.socialLinks.push(a.href);
          }
        });
      });

      const allLinks = Array.from(document.querySelectorAll('a'));
      result.hasBlog = allLinks.some(a => /blog|articles|news|journal/i.test(a.href + ' ' + a.textContent));
      result.hasContactForm = !!document.querySelector('form') || allLinks.some(a => /contact|get.in.touch/i.test(a.href + ' ' + a.textContent));

      document.querySelectorAll('button, a.btn, [class*="cta"], [class*="button"]').forEach((el, i) => {
        if (i < 5) { const text = el.textContent.trim().slice(0, 60); if (text) result.ctaButtons.push(text); }
      });

      return result;
    });

    if (data.title) emit('data', { type: 'title', value: data.title });
    emit('data', { type: 'images', value: data.imageCount });
    emit('data', { type: 'links', value: data.linkCount });
    emit('data', { type: 'wordCount', value: data.wordCount });
    emit('log', `Found ${data.h1.length} H1s, ${data.imageCount} images, ${data.linkCount} links`);

    if (data.socialLinks.length) {
      emit('data', { type: 'socialLinks', value: `${data.socialLinks.length} platforms` });
      emit('log', `Social links: ${data.socialLinks.map(l => new URL(l).hostname).join(', ')}`);
    }
    emit('log', `Blog: ${data.hasBlog ? 'Yes' : 'No'} | Contact form: ${data.hasContactForm ? 'Yes' : 'No'}`);

    data.loadTimeMs = loadTimeMs;
    data.statusCode = response?.status() || 0;
    data.platform = 'Website';
    data.url = url;
    data.scraped = true;

    emit('log', 'Website analysis complete');
    return data;
  } catch (err) {
    emit('log', `Scrape error: ${err.message}`);
    return { platform: 'Website', handle: inputUrl, scraped: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

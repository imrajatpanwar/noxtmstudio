import puppeteer from 'puppeteer';

export async function scrapeYouTube(handle, emit = () => {}) {
  const cleanHandle = handle.replace(/^@/, '');
  const url = `https://www.youtube.com/@${cleanHandle}`;
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

    emit('log', `Navigating to youtube.com/@${cleanHandle}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    await page.click('button[aria-label*="Accept"], tp-yt-paper-button.ytd-consent-bump-v2-lightbox').catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    emit('log', 'Extracting channel data...');
    const data = await page.evaluate(() => {
      const result = { name: '', subscribers: '', description: '', videoCount: '', handle: '' };
      result.name = document.querySelector('#channel-name yt-formatted-string, #channel-header ytd-channel-name yt-formatted-string')?.textContent?.trim() || '';
      result.subscribers = document.querySelector('#subscriber-count, yt-formatted-string#subscriber-count')?.textContent?.trim() || '';
      const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
      result.description = metaDesc.slice(0, 500);
      result.handle = document.querySelector('yt-formatted-string#channel-handle')?.textContent?.trim() || '';
      return result;
    });

    if (data.name) emit('data', { type: 'channel', value: data.name });
    if (data.subscribers) emit('data', { type: 'subscribers', value: data.subscribers });

    emit('log', 'Scanning recent videos...');
    const videosUrl = `${url}/videos`;
    await page.goto(videosUrl, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const videos = await page.evaluate(() => {
      const vids = [];
      const items = document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer');
      items.forEach((el, i) => {
        if (i >= 12) return;
        const title = el.querySelector('#video-title')?.textContent?.trim() || '';
        const views = el.querySelector('#metadata-line span')?.textContent?.trim() || '';
        const timeAgo = el.querySelectorAll('#metadata-line span')[1]?.textContent?.trim() || '';
        const duration = el.querySelector('ytd-thumbnail-overlay-time-status-renderer span')?.textContent?.trim() || '';
        vids.push({ title, views, timeAgo, duration });
      });
      return vids;
    }).catch(() => []);

    if (videos.length) {
      emit('data', { type: 'recentVideos', value: `${videos.length} videos found` });
      videos.slice(0, 3).forEach((v, i) => {
        emit('log', `Video ${i + 1}: "${v.title.slice(0, 50)}" — ${v.views} ${v.timeAgo}`);
      });
    }

    data.recentVideos = videos;
    data.platform = 'YouTube';
    data.url = url;
    data.scraped = !!(data.name || data.subscribers);

    emit('log', data.scraped ? 'Channel data extracted' : 'Limited data');
    return data;
  } catch (err) {
    emit('log', `Scrape error: ${err.message}`);
    return { platform: 'YouTube', handle, scraped: false, error: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

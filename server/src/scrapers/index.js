import { scrapeInstagram } from './instagram.js';
import { scrapeTwitter } from './twitter.js';
import { scrapeYouTube } from './youtube.js';
import { scrapeWebsite } from './website.js';

const scrapers = {
  'Instagram': scrapeInstagram,
  'Twitter/X': scrapeTwitter,
  'YouTube': scrapeYouTube,
  'LinkedIn': null,
  'Website': scrapeWebsite,
};

export async function scrapeProfile(platform, handle, emit = () => {}, opts = {}) {
  const scraper = scrapers[platform];
  if (!scraper) {
    return { platform, handle, scraped: false, error: `No scraper for ${platform}` };
  }
  // Instagram scraper uses instaloader, pass competitors via opts
  if (platform === 'Instagram' && opts.competitors) {
    // The instagram scraper's Python script handles competitors
    // We need to pass competitors through — update handle call
  }
  return scraper(handle, emit, opts);
}

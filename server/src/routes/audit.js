import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import Lead from '../models/Lead.js';
import { scrapeProfile } from '../scrapers/index.js';

const router = Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// SSE endpoint  - streams live scan events + final report
router.get('/stream', async (req, res) => {
  const { platform, handle, email, competitors } = req.query;
  if (!platform || !handle) return res.status(400).json({ error: 'Platform and handle required' });

  // Setup SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Emit function for scrapers
  const emit = (type, payload) => {
    if (type === 'log') send('log', { message: payload, time: Date.now() });
    else if (type === 'data') send('data', payload);
  };

  try {
    send('log', { message: `Starting ${platform} audit for ${handle}...`, time: Date.now() });
    send('phase', { phase: 'scraping' });

    // Step 1: Scrape
    const scrapedData = await scrapeProfile(platform, handle, emit, { competitors: competitors || '' });
    send('scraped', { success: scrapedData.scraped, data: scrapedData });

    // Step 2: AI Analysis
    send('phase', { phase: 'analyzing' });
    send('log', { message: 'Sending data to AI for analysis...', time: Date.now() });

    const dataBlock = scrapedData.scraped
      ? `\n\nHere is the REAL scraped data from their profile:\n${JSON.stringify(scrapedData, null, 2)}\n\nUse this real data to give an accurate, specific audit. Reference actual numbers, bio content, and posting patterns from the data.`
      : `\n\nNote: Scraping failed (${scrapedData.error || 'blocked'}), so provide a general audit based on common patterns for ${platform} accounts. Mention that this is a preliminary audit and a deeper manual review is recommended.`;

    const prompt = `You are an elite social media growth strategist. Audit the ${platform} account: ${handle}.
${dataBlock}

Return ONLY valid JSON (no markdown, no code fences, no extra text):
{
  "overall": <0-100>,
  "summary": "<one sharp sentence  - #1 growth blocker>",
  "dataNote": "<'Based on real profile data' or 'Preliminary audit'>",
  "profileSnapshot": {
    "followers": "<number or N/A>",
    "posts": "<number or N/A>",
    "bio": "<bio excerpt or N/A>",
    "engagementRate": "<% or N/A>",
    "postsPerWeek": "<number or N/A>"
  },
  "categories": [
    { "name": "Posting Frequency", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" },
    { "name": "Hook Quality", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" },
    { "name": "Visual Identity", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" },
    { "name": "Niche Clarity", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" },
    { "name": "Engagement Tactics", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" },
    { "name": "Content Variety", "score": <0-10>, "status": "<critical|warning|good>", "problem": "<max 8 words>", "fix": "<max 8 words>" }
  ],
  "postAnalysis": [
    {
      "index": <1-20>,
      "type": "<reel|image|video>",
      "date": "<readable date>",
      "likes": <number>,
      "comments": <number>,
      "views": <number or 0>,
      "caption": "<first 60 chars>",
      "verdict": "<good|average|poor>",
      "note": "<max 10 words>"
    }
  ],
  "trends": {
    "topHashtags": ["<tag1>", "<tag2>", "<tag3>"],
    "hashtagVerdict": "<max 12 words  - are they using right tags?>",
    "bestPostTime": "<e.g. Tuesdays at 7pm>",
    "contentTrend": "<max 12 words  - what content format is working best>",
    "nicheTrend": "<max 12 words  - where the niche is heading>"
  },
  "competitors": [
    {
      "handle": "<competitor handle>",
      "followers": <number>,
      "engRate": "<% or N/A>",
      "strength": "<max 8 words  - what they do better>",
      "weakness": "<max 8 words  - where target beats them>"
    }
  ],
  "quickWins": ["<max 12 words, immediate fix doable today>", "<...>", "<...>", "<...>"],
  "bioRewrite": "<rewritten optimized bio for this account, max 140 chars, or 'N/A'>",
  "benchmarks": {
    "engagementRate": { "yours": "<%>", "industry": "<typical % for this niche/size>", "verdict": "<above|average|below>" },
    "postingFrequency": { "yours": "<n/week>", "ideal": "<n/week>", "verdict": "<above|average|below>" },
    "followerRatio": { "value": "<followers:following ratio>", "verdict": "<max 8 words>" }
  },
  "contentStrategy": {
    "pillars": [
      { "name": "<pillar name>", "pct": <suggested % of content>, "why": "<max 10 words>" },
      { "name": "<pillar name>", "pct": <number>, "why": "<max 10 words>" },
      { "name": "<pillar name>", "pct": <number>, "why": "<max 10 words>" }
    ],
    "bestFormat": "<reel|carousel|image|video>",
    "formatNote": "<max 12 words>"
  },
  "growthForecast": {
    "current30": "<follower estimate in 30 days if nothing changes>",
    "optimized30": "<follower estimate in 30 days with fixes applied>",
    "optimized90": "<follower estimate in 90 days with fixes applied>",
    "note": "<max 12 words, what drives the difference>"
  },
  "actionPlan": [
    { "week": 1, "focus": "<max 6 words>", "actions": ["<max 10 words>", "<max 10 words>"] },
    { "week": 2, "focus": "<max 6 words>", "actions": ["<max 10 words>", "<max 10 words>"] },
    { "week": 3, "focus": "<max 6 words>", "actions": ["<max 10 words>", "<max 10 words>"] },
    { "week": 4, "focus": "<max 6 words>", "actions": ["<max 10 words>", "<max 10 words>"] }
  ]
}

Rules:
- status: critical(<5), warning(5-7), good(>7). overall = avg scores * 10
- KEEP ALL TEXT FIELDS SHORT. Max 8-12 words. Punchy, not sentences.
- postAnalysis: include ALL posts from data. verdict based on avg engagement.
- trends: analyze hashtag effectiveness, best times, content patterns.
- competitors: only if competitor data provided, else empty [].
- quickWins: 4 highest-impact fixes the owner can do TODAY.
- benchmarks: compare against realistic industry numbers for this niche and account size.
- growthForecast: ground estimates in current follower count and engagement. Be realistic, not hype.
- actionPlan: concrete weekly roadmap building toward the fixes in categories.
- Reference real numbers everywhere.
- NEVER use em dash character. Use comma or period instead.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const report = JSON.parse(jsonStr);

    send('log', { message: 'Analysis complete', time: Date.now() });

    // Save lead
    if (email) {
      await Lead.create({
        name: handle,
        email: decodeURIComponent(email),
        message: `${platform} audit for ${handle} | Score: ${report.overall}/100`,
        source: 'audit-form',
      }).catch(() => {});
    }

    send('phase', { phase: 'done' });
    send('report', report);
    res.end();
  } catch (err) {
    console.error('Audit stream error:', err?.message || err);
    send('error', { message: err?.message || 'Audit failed' });
    res.end();
  }
});

// Keep POST for backwards compat
router.post('/', async (req, res) => {
  const { platform, handle, email } = req.body;
  if (!platform || !handle) return res.status(400).json({ error: 'Platform and handle required' });
  try {
    const scrapedData = await scrapeProfile(platform, handle);
    const dataBlock = scrapedData.scraped
      ? `\n\nREAL scraped data:\n${JSON.stringify(scrapedData, null, 2)}\n\nUse real data for accurate audit.`
      : `\n\nScraping failed. Provide general audit.`;

    const prompt = `You are a social media growth expert. Audit ${platform}: ${handle}.${dataBlock}\n\nReturn ONLY valid JSON: {"overall":<0-100>,"summary":"...","dataNote":"...","profileSnapshot":{"followers":"...","posts":"...","bio":"..."},"categories":[{"name":"...","score":<0-10>,"status":"...","problem":"...","fix":"..."}]}. 6 categories: Posting Frequency, Hook Quality, Visual Identity, Niche Clarity, Engagement Tactics, Content Variety. status: critical(<5), warning(5-7), good(>7).`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const report = JSON.parse(jsonStr);

    if (email) {
      await Lead.create({ name: handle, email, message: `${platform} audit | Score: ${report.overall}/100`, source: 'audit-form' }).catch(() => {});
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Audit failed' });
  }
});

export default router;

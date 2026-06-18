import 'dotenv/config';
import { connectDB } from './db.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Page from './models/Page.js';
import Post from './models/Post.js';
import Event from './models/Event.js';
import TeamMember from './models/TeamMember.js';
import ChatConfig from './models/ChatConfig.js';
import SiteSettings from './models/SiteSettings.js';

async function run() {
  await connectDB(process.env.MONGODB_URI);

  const email = (process.env.ADMIN_EMAIL || 'admin@noxtm.studio').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin12345';

  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'Noxtm Admin', email, password, role: 'admin' });
    console.log(`Admin user created: ${email} / ${password}`);
  } else {
    console.log('Admin user already exists');
  }

  await SiteSettings.findOneAndUpdate(
    {},
    {
      siteName: 'Noxtm Studio',
      tagline: 'Where design leads.',
      logoText: 'NOXTM',
      contactEmail: 'hello@noxtm.studio',
      contactPhone: '+1 (555) 010-2025',
      socials: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        instagram: 'https://instagram.com',
        dribbble: 'https://dribbble.com',
      },
    },
    { upsert: true }
  );

  await Page.findOneAndUpdate(
    { slug: 'home' },
    {
      slug: 'home',
      title: 'Home',
      published: true,
      sections: {
        hero: {
          eyebrow: 'Design studio',
          headline: 'Where design leads',
          sub: 'A product design studio shaping the future of digital products, brands, and systems for ambitious teams.',
          ctaPrimary: { label: 'Start a project', href: '/contact' },
          ctaSecondary: { label: 'See our work', href: '/work' },
        },
        stats: [
          { value: '120+', label: 'Products shipped' },
          { value: '40+', label: 'Brands served' },
          { value: '9', label: 'Years of craft' },
          { value: '4.9', label: 'Avg. client rating' },
        ],
        services: [
          { title: 'Product Design', desc: 'End-to-end UX/UI for web and mobile products that scale.' },
          { title: 'Brand & Identity', desc: 'Visual systems, logos, and guidelines that make brands unmistakable.' },
          { title: 'Design Systems', desc: 'Reusable component libraries that keep teams fast and consistent.' },
        ],
        ctaBand: {
          headline: 'Have a project in mind?',
          sub: "Tell us what you're building. We'll bring the design firepower.",
          cta: { label: 'Get in touch', href: '/contact' },
        },
      },
    },
    { upsert: true }
  );

  if ((await Post.countDocuments()) === 0) {
    await Post.create([
      {
        title: 'Designing for clarity, not decoration',
        slug: 'designing-for-clarity',
        excerpt: 'Why the best interfaces get out of the way.',
        body: 'Good design is invisible. In this piece we break down how we strip interfaces back to what matters.',
        author: 'Noxtm Studio',
        tags: ['ux', 'principles'],
        published: true,
        publishedAt: new Date(),
      },
      {
        title: 'Building a design system from zero',
        slug: 'design-system-from-zero',
        excerpt: 'A practical playbook for teams starting their first system.',
        body: 'Tokens, components, documentation — here is the order we tackle things in.',
        author: 'Noxtm Studio',
        tags: ['design systems'],
        published: true,
        publishedAt: new Date(),
      },
    ]);
    console.log('Sample posts created');
  }

  if ((await Event.countDocuments()) === 0) {
    await Event.create([
      {
        title: 'Noxtm Design Jam 2026',
        description: 'A one-day workshop on product thinking and rapid prototyping.',
        location: 'Online',
        startDate: new Date('2026-09-12'),
        published: true,
      },
    ]);
    console.log('Sample event created');
  }

  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.create([
      { name: 'Aria Patel', role: 'Founder & Design Lead', order: 1, bio: 'Leads product strategy and craft.' },
      { name: 'Leo Martins', role: 'Principal Product Designer', order: 2, bio: 'Systems, interaction, prototyping.' },
      { name: 'Mei Tanaka', role: 'Brand Designer', order: 3, bio: 'Identity, type, and motion.' },
    ]);
    console.log('Sample team created');
  }

  await ChatConfig.findOneAndUpdate(
    {},
    {
      enabled: true,
      title: 'Chat with Noxtm',
      welcome: 'Hi! How can we help with your design project?',
      fallback: "Great question — drop your email and the team will follow up shortly.",
      rules: [
        { keywords: ['price', 'cost', 'pricing', 'budget'], answer: 'Projects typically start at $5k. Share your scope and we will send a tailored quote.' },
        { keywords: ['service', 'do you', 'offer'], answer: 'We do product design, brand identity, and design systems.' },
        { keywords: ['contact', 'email', 'reach', 'talk'], answer: 'You can reach us at hello@noxtm.studio or leave your email here.' },
        { keywords: ['hello', 'hi', 'hey'], answer: 'Hey there! What are you working on?' },
      ],
    },
    { upsert: true }
  );

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

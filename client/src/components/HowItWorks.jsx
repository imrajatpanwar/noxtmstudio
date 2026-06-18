import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Camera,
  CalendarClock,
  MessagesSquare,
  LineChart,
  ShieldCheck,
  Clock,
} from 'lucide-react';

/*
  HowItWorks — "You vs. Us" split (Concept B)
  Positioning: zero effort for the client. The visual imbalance between the
  near-empty "Your side" and the full "Our side" IS the argument.

  Drop-in usage (e.g. in Home.jsx):
    import HowItWorks from '../components/HowItWorks.jsx';
    ...
    <HowItWorks />

  Optional overrides:
    <HowItWorks
      ctaLabel="Apply to Work With Us"
      ctaHref="/audit"
    />
*/

const YOUR_SIDE = [
  { label: 'Approve the work', detail: 'One click. ~10 minutes a week.' },
];

const OUR_SIDE = [
  {
    icon: Sparkles,
    title: 'Strategy & positioning',
    detail: 'Brand audit, competitor teardown, data-backed roadmap. Built before you lift a finger.',
  },
  {
    icon: Camera,
    title: 'Content production',
    detail: 'We script, shoot, and edit every reel in-house. No briefs, no editors to chase.',
  },
  {
    icon: CalendarClock,
    title: 'Posting & scheduling',
    detail: 'Full calendar ownership across every platform. You never touch a scheduler.',
  },
  {
    icon: MessagesSquare,
    title: 'Community & engagement',
    detail: 'DMs, comments, real-time replies handled by your team. In your voice.',
  },
  {
    icon: LineChart,
    title: 'Reporting & optimisation',
    detail: 'A transparent monthly readout tied to revenue. We bring the insight.',
  },
];

const ASSURANCES = [
  { icon: ShieldCheck, label: 'Senior-led account', detail: 'A principal owns it — not a junior.' },
  { icon: Clock, label: 'Day-one welcome kit', detail: 'Timelines and scope locked from start.' },
  { icon: Check, label: 'No chasing, ever', detail: "We tell you what's done. No follow-up." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: i * 0.08 },
  }),
};

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* soft accent glow */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-x relative">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl"
        >
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl">
            You do almost nothing.
            <br />
            <span className="text-sage">We run the machine.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Premium clients don&rsquo;t want another tool to manage or another
            inbox to babysit. You hand it over once — we own everything after.
          </p>
        </motion.div>

        {/* Split */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-[0.8fr_1.2fr]">
          {/* YOUR SIDE — deliberately sparse */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col bg-ink p-8 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Your side
            </p>
            <div className="mt-10 flex flex-1 flex-col justify-center">
              {YOUR_SIDE.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-sage">
                    <Check size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
              <p className="mt-10 font-display text-2xl font-medium text-white/40">
                That&rsquo;s it.
              </p>
            </div>
          </motion.div>

          {/* OUR SIDE — full, busy on purpose */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={1}
            className="bg-panel p-8 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Our side
            </p>
            <ul className="mt-8 space-y-6">
              {OUR_SIDE.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.title}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-sage">
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-white sm:text-lg">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {item.detail}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Assurances */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ASSURANCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="flex items-start gap-3 rounded-2xl border border-line bg-panel/60 p-5"
              >
                <span className="mt-0.5 text-sage">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{a.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{a.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

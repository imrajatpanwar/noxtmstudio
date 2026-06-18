/**
 * CurvedStrip — Framer Motion panoramic image gallery.
 *
 * CSS perspective on parent + per-card rotateY + translateZ creates the
 * cinematic curved-fan look matching the ux-india.org reference.
 *
 * Structure (avoids overflow:hidden + 3-D conflict):
 *   <section overflow:hidden>          ← page clip
 *     <div perspective:2000px>          ← 3-D context
 *       <motion.div rotateY + z>        ← transform, NO overflow
 *         <div borderRadius overflow>   ← visual card
 *           <img>
 *
 * Framer Motion handles:
 *   • staggered fade + slide-up entrance (whileInView)
 *   • scale + lift on hover (whileHover)
 */

import { motion } from 'framer-motion';

/* ─── image pool ──────────────────────────────────────────────── */
const IMAGES = [
  { id: 0,  src: 'https://picsum.photos/seed/nxs21/480/720' },
  { id: 1,  src: 'https://picsum.photos/seed/nxs22/480/720' },
  { id: 2,  src: 'https://picsum.photos/seed/nxs23/480/720' },
  { id: 3,  src: 'https://picsum.photos/seed/nxs24/480/720' },
  { id: 4,  src: 'https://picsum.photos/seed/nxs25/480/720' },
  { id: 5,  src: 'https://picsum.photos/seed/nxs26/480/720' },
  { id: 6,  src: 'https://picsum.photos/seed/nxs27/480/720' },
  { id: 7,  src: 'https://picsum.photos/seed/nxs28/480/720' },
  { id: 8,  src: 'https://picsum.photos/seed/nxs29/480/720' },
  { id: 9,  src: 'https://picsum.photos/seed/nxs30/480/720' },
  { id: 10, src: 'https://picsum.photos/seed/nxs31/480/720' },
  { id: 11, src: 'https://picsum.photos/seed/nxs32/480/720' },
  { id: 12, src: 'https://picsum.photos/seed/nxs33/480/720' },
];

/* ─── layout constants ────────────────────────────────────────── */
const N        = IMAGES.length;          // 13
const CENTER   = Math.floor(N / 2);      // 6
const MAX_ROTY = 72;   // ° rotation at outermost card
const MAX_TZ   = 120;  // px translateZ boost at center card
const CARD_W   = 175;  // px
const CARD_H   = 390;  // px
const OVERLAP  = 48;   // px negative overlap between consecutive cards

/* ─── subtle background arc lines ────────────────────────────── */
function BgLines() {
  const arcs = [
    'M -150 600 Q 720 -60 1590 600',
    'M -150 680 Q 720  20 1590 680',
    'M -150 760 Q 720  80 1590 760',
    'M  150  30 Q 720 450 1290  30',
    'M  250  10 Q 720 380 1190  10',
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {arcs.map((d, i) => (
        <path key={i} d={d} stroke="#b8a490" strokeWidth="1.2" opacity={0.10 + i * 0.015} />
      ))}
    </svg>
  );
}

/* ─── component ───────────────────────────────────────────────── */
export default function CurvedStrip() {
  return (
    <section
      className="relative w-full select-none overflow-hidden"
      style={{ background: '#f3efe8', paddingTop: 52, paddingBottom: 56 }}
    >
      <BgLines />

      {/* 3-D perspective container */}
      <div
        className="relative flex items-end justify-center"
        style={{ perspective: '2000px', perspectiveOrigin: '50% 50%' }}
      >
        {IMAGES.map((img, i) => {
          const offset  = i - CENTER;                        // –6 … +6
          const norm    = offset / CENTER;                   // –1 … +1
          const rotY    = norm * MAX_ROTY;                   // –72 … +72 °
          const tz      = (1 - Math.abs(norm)) * MAX_TZ;    // 120 px at centre, 0 at edge
          const restY   = Math.abs(norm) * 20;              // edge cards sit 20 px lower
          const zIdx    = N - Math.abs(offset);             // centre renders on top

          return (
            <motion.div
              key={img.id}
              /* entrance: slide up + fade, staggered from centre outward */
              initial={{ opacity: 0, y: restY + 72 }}
              whileInView={{
                opacity: 1,
                y: restY,
                transition: {
                  duration: 0.68,
                  delay: Math.abs(offset) * 0.07,
                  ease: [0.22, 1.0, 0.36, 1.0],
                },
              }}
              viewport={{ once: true, amount: 0.25 }}
              /* hover: lift + scale */
              whileHover={{
                y: restY - 22,
                scale: 1.06,
                transition: { duration: 0.26, ease: 'easeOut' },
              }}
              /* 3-D pose (static; not part of animation variants) */
              style={{
                rotateY: rotY,
                z: tz,
                zIndex: zIdx,
                marginLeft: i === 0 ? 0 : -OVERLAP,
                flexShrink: 0,
                cursor: 'pointer',
              }}
              className="group"
            >
              {/* inner card: handles visual clipping + shadow (no transform here) */}
              <div
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 24,
                  overflow: 'hidden',
                  /* shadow deepens on hover via group */
                  boxShadow:
                    '0 6px 28px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.10)',
                  transition: 'box-shadow 0.28s ease',
                }}
                className="group-hover:[box-shadow:0_18px_60px_rgba(0,0,0,0.28),0_4px_14px_rgba(0,0,0,0.14)]"
              >
                <img
                  src={img.src}
                  alt=""
                  width={CARD_W}
                  height={CARD_H}
                  loading="lazy"
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

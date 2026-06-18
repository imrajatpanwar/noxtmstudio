import { useEffect, useRef } from "react";

/**
 * PhotoArcCarousel
 * Concave arc effect — edges larger & tilted toward viewer, center smaller.
 *
 * Props:
 *   images     — array of { src: string, alt?: string }
 *   speed      — auto-scroll px/frame (default 0.5)
 *   cardWidth  — card width in px (default 160)
 *   gap        — gap between cards in px (default 10)
 *   background — section bg color (default #F5F0E4)
 */
export default function PhotoArcCarousel({
  images     = DEFAULT_IMAGES,
  speed      = 0.5,
  cardWidth  = 175,
  cardHeight = 300,
  gap        = 0,
  background = "#F5F0E4",
}) {
  const wrapRef  = useRef(null);
  const trackRef = useRef(null);
  const s        = useRef({ offset: 0, paused: false, dragging: false, dragX: 0, dragOff: 0 });
  const rafRef   = useRef(null);

  const all    = [...images, ...images, ...images];   // uniform height — no alternating
  const STRIDE = cardWidth + gap;
  const LOOP_W = images.length * STRIDE;

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    s.current.offset = -LOOP_W;
    const cards = track.querySelectorAll(".pac-card");

    // mouse drag
    const onDown = (e) => { s.current.dragging = true; s.current.dragX = e.clientX; s.current.dragOff = s.current.offset; s.current.paused = true; wrap.style.cursor = "grabbing"; };
    const onMove = (e) => { if (s.current.dragging) s.current.offset = s.current.dragOff + (e.clientX - s.current.dragX); };
    const onUp   = ()  => { if (s.current.dragging) { s.current.dragging = false; s.current.paused = false; wrap.style.cursor = "grab"; } };
    wrap.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);

    // touch drag
    const onTDown = (e) => { s.current.dragging = true; s.current.dragX = e.touches[0].clientX; s.current.dragOff = s.current.offset; s.current.paused = true; };
    const onTMove = (e) => { if (s.current.dragging) s.current.offset = s.current.dragOff + (e.touches[0].clientX - s.current.dragX); };
    const onTUp   = ()  => { s.current.dragging = false; s.current.paused = false; };
    wrap.addEventListener("touchstart", onTDown, { passive: true });
    window.addEventListener("touchmove",  onTMove, { passive: true });
    window.addEventListener("touchend",   onTUp);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!s.current.paused) s.current.offset -= speed;
      if (s.current.offset < -LOOP_W * 2) s.current.offset += LOOP_W;
      if (s.current.offset > -LOOP_W)     s.current.offset -= LOOP_W;

      track.style.transform = `translateX(${s.current.offset}px)`;

      const wW = wrap.clientWidth;
      const cx = wW / 2;

      cards.forEach((card) => {
        const cardCx = card.offsetLeft + s.current.offset + cardWidth / 2;
        const relX   = cardCx - cx;
        const t      = Math.max(-1, Math.min(1, relX / (wW * 0.48)));
        const abs    = Math.abs(t);

        // concave: edges bigger + tilt inward, center smaller + flat
        const scale   = 0.82 + abs * 0.26;   // 0.82 → 1.08
        const rotateY = t * -38;              // reduced tilt → less foreshortening at edges
        const tz      = abs * 60;             // less Z push → less perspective distortion
        card.style.transform = `perspective(900px) rotateY(${rotateY}deg) scale(${scale}) translateZ(${tz}px)`;
        card.style.opacity   = '1';
      });
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      wrap.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      wrap.removeEventListener("touchstart", onTDown);
      window.removeEventListener("touchmove",  onTMove);
      window.removeEventListener("touchend",   onTUp);
    };
  }, [images, speed, cardWidth, cardHeight, gap, LOOP_W]);

  return (
    <div
      ref={wrapRef}
      style={{ overflow: "hidden", padding: "40px 0", width: "100%", cursor: "grab", userSelect: "none", WebkitUserSelect: "none", position: "relative", zIndex: 10 }}
    >
      <div
        ref={trackRef}
        style={{ display: "flex", alignItems: "center", gap: `${gap}px`, willChange: "transform", padding: "36px 0" }}
      >
        {all.map((img, i) => (
          <div
            key={i}
            className="pac-card"
            style={{ flexShrink: 0, width: cardWidth, height: cardHeight, borderRadius: 20, overflow: "hidden", transformOrigin: "center center" }}
          >
            <img
              src={img.src}
              alt={img.alt ?? ""}
              loading="lazy"
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Replace with your own event photos
const DEFAULT_IMAGES = [
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=320&h=480&fit=crop", alt: "Conference session" },
  { src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=320&h=460&fit=crop", alt: "Speaker on stage" },
  { src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=320&h=480&fit=crop", alt: "Networking" },
  { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=320&h=460&fit=crop", alt: "Workshop" },
  { src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=320&h=480&fit=crop", alt: "Panel discussion" },
  { src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=320&h=460&fit=crop", alt: "Attendees" },
  { src: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=320&h=480&fit=crop", alt: "Keynote" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=320&h=460&fit=crop", alt: "Team photo" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=320&h=480&fit=crop", alt: "Breakout session" },
  { src: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=320&h=460&fit=crop", alt: "Community" },
  { src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=320&h=480&fit=crop", alt: "Group celebration" },
  { src: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=320&h=460&fit=crop", alt: "Presentation" },
  { src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=320&h=480&fit=crop", alt: "Creative workshop" },
  { src: "https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=320&h=460&fit=crop", alt: "Discussion" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=320&h=480&fit=crop", alt: "Event hall" },
  { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=320&h=460&fit=crop", alt: "Collaboration" },
  { src: "https://images.unsplash.com/photo-1544531586-fbb6c28a2d9b?w=320&h=480&fit=crop", alt: "Stage lighting" },
  { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=320&h=460&fit=crop", alt: "Audience" },
  { src: "https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=320&h=480&fit=crop", alt: "Award ceremony" },
  { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=320&h=460&fit=crop", alt: "Team meeting" },
];

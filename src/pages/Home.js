import React, { useEffect, useState, useRef } from 'react';
import Footer from '../components/Footer';
import api from '../api';
import './Home.css';

/* ── Image imports ── */
import InstagramSvg from './image/Instgram.svg';
import LinkedinSvg from './image/Linkedin.svg';
import XSvg from './image/X.svg';
import Avatar1 from './image/Avatar01.svg';
import Avatar2 from './image/Avatar02.svg';
import Avatar3 from './image/Avatar03.svg';
import Avatar4 from './image/Avatar04.svg';
import MetaLogo from './image/MetaLogo.svg';
import GoogleAds from './image/GoogleAds.svg';
import FootersBg from './image/footers_file.webp';

/* Hero background images — fast webp placeholder + full-quality PNG */
const HeroBgWebp = process.env.PUBLIC_URL + '/images/noxtm_studio.webp';
const HeroBgFull = process.env.PUBLIC_URL + '/images/noxtmstudio_jpg_file.png';

/* ── Circle folder assets (served from public/) ── */
const ArchOuter = process.env.PUBLIC_URL + '/images/circle/Arch-Outer.svg';
const ArchMid = process.env.PUBLIC_URL + '/images/circle/Arch-Mid.svg';
const ArchInner = process.env.PUBLIC_URL + '/images/circle/Arch-Inner.svg';
const AvatarIG = process.env.PUBLIC_URL + '/images/circle/Avatar-Instagram.svg';
const AvatarLI = process.env.PUBLIC_URL + '/images/circle/Avatar-LinkedIn.svg';
const AvatarX = process.env.PUBLIC_URL + '/images/circle/Avatar-X.svg';
const BadgeViews = process.env.PUBLIC_URL + '/images/circle/Badge-PostViews.svg';
const BadgeGrowth = process.env.PUBLIC_URL + '/images/circle/Badge-FocusGrowth.svg';
const Text1M = process.env.PUBLIC_URL + '/images/circle/Text-1M.svg';
const TextFollowers = process.env.PUBLIC_URL + '/images/circle/Text-Followers.svg';

/* ── Data ────────────────────────────────────────────────────── */

const SERVICES = [
    {
        hindi: 'सोशल मीडिया',
        title: 'Social Media Management',
        desc: 'We craft scroll-stopping content, build engaged communities, and grow your brand presence across Instagram, LinkedIn, Facebook & X — rooted in cultural storytelling that resonates with Indian audiences.',
        tags: ['Instagram', 'LinkedIn', 'Facebook', 'X (Twitter)'],
        gradient: 'gradient-saffron',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="service-svg">
                <rect x="10" y="10" width="60" height="60" rx="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="40" cy="35" r="12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <path d="M22 58c0-8 8-14 18-14s18 6 18 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="58" cy="22" r="6" fill="rgba(255,255,255,0.3)" />
                <path d="M56 22h4M58 20v4" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        hindi: 'मेटा विज्ञापन',
        title: 'Performance Marketing',
        desc: 'Data-driven Facebook & Instagram ad campaigns that deliver results. From audience targeting to creative optimization, we maximize your ROAS with precision that transforms your ad spend into measurable growth.',
        tags: ['Facebook Ads', 'Instagram Ads', 'Retargeting', 'Analytics'],
        gradient: 'gradient-blue',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="service-svg">
                <path d="M15 60V25l25-12 25 12v35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <path d="M15 25l25 12 25-12" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M40 37v23" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <circle cx="40" cy="30" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <path d="M37 30l2 2 4-4" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="25" y="50" width="8" height="10" rx="2" fill="rgba(255,255,255,0.2)" />
                <rect x="36" y="45" width="8" height="15" rx="2" fill="rgba(255,255,255,0.25)" />
                <rect x="47" y="42" width="8" height="18" rx="2" fill="rgba(255,255,255,0.3)" />
            </svg>
        ),
    },
    {
        hindi: 'ग्राफिक डिज़ाइन',
        title: 'Graphic Design',
        desc: 'From brand identity to social media creatives, our designers blend Indian aesthetic traditions with contemporary design thinking. Every visual tells your brand story with cultural depth and modern sophistication.',
        tags: ['Brand Identity', 'Social Creatives', 'Print Design', 'Motion Graphics'],
        gradient: 'gradient-emerald',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="service-svg">
                <rect x="12" y="12" width="56" height="56" rx="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="30" cy="30" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <path d="M12 55l18-18 12 12 8-8 18 18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="55" cy="28" r="5" fill="rgba(255,255,255,0.25)" />
            </svg>
        ),
    },
];

const BLOG_ITEMS = [];

const CASE_STUDIES = [
    {
        title: 'Curationist',
        subtitle: 'Reimagine Culture',
        desc: 'Explore the stories behind public domain images of art and artifacts.',
        color: '#D4A843',
        gradient: 'linear-gradient(180deg, #E8C860 0%, #C9922A 100%)',
    },
    {
        title: 'Abutre-preto',
        subtitle: 'Douro Internacional',
        desc: 'Nature conservation app with GPS coordinates and directions.',
        color: '#5B8C6F',
        gradient: 'linear-gradient(180deg, #7BAF8E 0%, #4A7A5E 100%)',
    },
    {
        title: 'Dia Health',
        subtitle: 'Reddot Winner 2022',
        desc: 'Period tracking and fertility app with award-winning design.',
        color: '#E87B8A',
        gradient: 'linear-gradient(180deg, #F09BA5 0%, #D65F72 100%)',
    },
    {
        title: 'Zoko',
        subtitle: 'Team Communication',
        desc: 'Supercharging team chats with smart collaboration tools.',
        color: '#E8A07B',
        gradient: 'linear-gradient(180deg, #F0BDA0 0%, #D6875F 100%)',
    },
];

const TESTIMONIALS = [
    {
        quote: 'Noxtm Studio transformed our social media presence completely. Their understanding of cultural nuances combined with data-driven strategies helped us achieve 3× engagement growth in just 3 months.',
        name: 'Priya Sharma',
        role: 'Marketing Head, Ethnic Wear Brand',
    },
];

const UPDATES = [];

const TRUST_LOGOS = [
    'अमूल', 'तात्या', 'महिन्द्रा', 'पतंजलि', 'फैब इंडिया', 'बाटा'
];

/* ── Counter Animation Hook ─────────────────────────────────── */
function useCounterAnimation(end, duration = 2000, start = 0) {
    const [count, setCount] = useState(start);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(node);
        return () => observer.unobserve(node);
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;
        let startTime;
        let raf;
        const animate = (now) => {
            if (!startTime) startTime = now;
            const p = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(start + (end - start) * ease));
            if (p < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => { if (raf) cancelAnimationFrame(raf); };
    }, [isVisible, end, duration, start]);

    return [count, ref, isVisible];
}

/* ── Shared-visibility counter (driven by an external isVisible flag) ── */
function useSharedCounter(end, duration, start, isVisible) {
    const [count, setCount] = useState(start);
    useEffect(() => {
        if (!isVisible) return;
        let startTime;
        let raf;
        const animate = (now) => {
            if (!startTime) startTime = now;
            const p = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(start + (end - start) * ease));
            if (p < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => { if (raf) cancelAnimationFrame(raf); };
    }, [isVisible, end, duration, start]);
    return count;
}

/* ── Animated Social Media Showcase ────────────────────────── */
function AnimatedMetricsShowcase() {
    /* One ref drives visibility for ALL counters */
    const [, rootRef, isVisible] = useCounterAnimation(1, 2500);
    const postViews = useSharedCounter(606, 2200, 0, isVisible);
    const focusGrowth = useSharedCounter(100, 2200, 0, isVisible);

    return (
        <div className="smc-root" ref={rootRef}>
            {/* ── Jharokha arch background ── */}
            <div className="smc-arch">
                <svg viewBox="0 0 420 480" fill="none" className="smc-arch-svg" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="archFrame" x1="210" y1="0" x2="210" y2="480" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#9ecbf5"/>
                            <stop offset="40%" stopColor="#b5dafc"/>
                            <stop offset="100%" stopColor="#8bbeed"/>
                        </linearGradient>
                        <linearGradient id="archWhite" x1="210" y1="80" x2="210" y2="460" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ffffff"/>
                            <stop offset="60%" stopColor="#fafdff"/>
                            <stop offset="100%" stopColor="#f0f7ff"/>
                        </linearGradient>
                        <filter id="archGlow" x="-18%" y="-10%" width="136%" height="120%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur"/>
                            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.75  0 0 0 0 0.95  0 0 0 0.45 0" result="glow"/>
                            <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>

                    {/* Outer arch — Jharokha with pointed tip + cusp notches */}
                    <path d="
                        M 18 468 L 18 210
                        C 18 160, 48 135, 88 122
                        C 98 119, 105 122, 108 135
                        C 118 95, 155 45, 210 15
                        C 265 45, 302 95, 312 135
                        C 315 122, 322 119, 332 122
                        C 372 135, 402 160, 402 210
                        L 402 468 Z
                    " fill="url(#archFrame)" filter="url(#archGlow)"/>

                    {/* Inner arch — white interior */}
                    <path d="
                        M 50 468 L 50 225
                        C 50 185, 72 163, 106 153
                        C 114 151, 120 153, 122 162
                        C 132 128, 164 82, 210 48
                        C 256 82, 288 128, 298 162
                        C 300 153, 306 151, 314 153
                        C 348 163, 370 185, 370 225
                        L 370 468 Z
                    " fill="url(#archWhite)"/>

                    {/* Outer outline */}
                    <path d="
                        M 18 468 L 18 210
                        C 18 160, 48 135, 88 122
                        C 98 119, 105 122, 108 135
                        C 118 95, 155 45, 210 15
                        C 265 45, 302 95, 312 135
                        C 315 122, 322 119, 332 122
                        C 372 135, 402 160, 402 210
                        L 402 468
                    " fill="none" stroke="#7db8e8" strokeWidth="1.2" opacity="0.35"/>

                    {/* Inner outline */}
                    <path d="
                        M 50 468 L 50 225
                        C 50 185, 72 163, 106 153
                        C 114 151, 120 153, 122 162
                        C 132 128, 164 82, 210 48
                        C 256 82, 288 128, 298 162
                        C 300 153, 306 151, 314 153
                        C 348 163, 370 185, 370 225
                        L 370 468
                    " fill="none" stroke="#a8d4f5" strokeWidth="0.8" opacity="0.3"/>

                    {/* Base sill */}
                    <rect x="14" y="462" width="392" height="16" rx="3" fill="url(#archFrame)"/>
                    <line x1="14" y1="462" x2="406" y2="462" stroke="#7db8e8" strokeWidth="1" opacity="0.3"/>
                </svg>
            </div>

            {/* ── Floating social icons ── */}
            <div className="smc-icon smc-icon-ig">
                <img src={InstagramSvg} alt="Instagram" />
            </div>
            <div className="smc-icon smc-icon-li">
                <img src={LinkedinSvg} alt="LinkedIn" />
            </div>
            <div className="smc-icon smc-icon-x">
                <img src={XSvg} alt="X" />
            </div>

            {/* ── Big counter ── */}
            <div className="smc-counter smc-pop" style={{animationDelay:'0.15s'}}>
                <span className="smc-num">1M</span>
                <span className="smc-lbl">Followers</span>
            </div>

            {/* ── Post Views badge ── */}
            <div className="smc-badge smc-badge-views smc-pop" style={{animationDelay:'0.85s'}}>
                <span className="smc-badge-title">Post views</span>
                <span className="smc-badge-row">
                    <span className="smc-arrow-circle">&#8593;</span>
                    <span className="smc-green">+{postViews}k</span>
                    <span className="smc-gray">(+210.1%)</span>
                </span>
            </div>

            {/* ── Focus Growth badge ── */}
            <div className="smc-badge smc-badge-growth smc-pop" style={{animationDelay:'1.0s'}}>
                <span className="smc-badge-title">Focus Growth</span>
                <div className="smc-growth-inner">
                    <div className="smc-avatars">
                        <img src={Avatar1} alt="" />
                        <img src={Avatar2} alt="" />
                        <img src={Avatar3} alt="" />
                        <img src={Avatar4} alt="" />
                        <span className="smc-av-count">+99</span>
                    </div>
                    <span className="smc-growth-pill">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9l3-3 3 3 4-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        +{focusGrowth}k
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ── Milestone Counter ───────────────────────────────────────── */
const MILESTONES = ['10k', '50k', '100k', '200k', '300k', '1M'];

function MilestoneCounter() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= MILESTONES.length - 1) return;
        const delay = index === 0 ? 500 : 380;
        const timer = setTimeout(() => {
            setIndex((i) => i + 1);
        }, delay);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <span className="sm-milestone-counter">
            {MILESTONES[index]}
        </span>
    );
}

/* ── Rangoli Divider SVG ─────────────────────────────────────── */
function RangoliDivider() {
    return (
        <svg className="rangoli-divider" viewBox="0 0 400 20" fill="none">
            <line x1="0" y1="10" x2="160" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <circle cx="175" cy="10" r="2" fill="currentColor" opacity="0.2" />
            <circle cx="190" cy="10" r="3" fill="currentColor" opacity="0.15" />
            <circle cx="200" cy="10" r="4" fill="currentColor" opacity="0.25" />
            <circle cx="210" cy="10" r="3" fill="currentColor" opacity="0.15" />
            <circle cx="225" cy="10" r="2" fill="currentColor" opacity="0.2" />
            <line x1="240" y1="10" x2="400" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </svg>
    );
}

/* ── Cultural Ornament SVG ───────────────────────────────────── */
function CulturalOrnament({ className }) {
    return (
        <svg className={`cultural-ornament ${className || ''}`} viewBox="0 0 240 70" fill="none">
            <path d="M40 35 C40 15, 70 5, 80 25 C90 5, 110 15, 110 35" stroke="currentColor" strokeWidth="1.2" opacity="0.35" fill="none" />
            <path d="M50 35 C50 22, 70 14, 80 28" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
            <circle cx="120" cy="35" r="18" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
            <circle cx="120" cy="35" r="10" stroke="currentColor" strokeWidth="1" opacity="0.25" />
            <circle cx="120" cy="35" r="3" fill="currentColor" opacity="0.2" />
            <path d="M120 17 Q128 28 120 39 Q112 28 120 17" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M102 35 Q113 27 124 35 Q113 43 102 35" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M120 53 Q128 42 120 31 Q112 42 120 53" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M138 35 Q127 27 116 35 Q127 43 138 35" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M130 35 C130 15, 160 5, 170 25 C180 5, 200 15, 200 35" stroke="currentColor" strokeWidth="1.2" opacity="0.35" fill="none" />
            <path d="M140 35 C140 22, 160 14, 170 28" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
            <circle cx="30" cy="35" r="2" fill="currentColor" opacity="0.2" />
            <circle cx="210" cy="35" r="2" fill="currentColor" opacity="0.2" />
        </svg>
    );
}

/* ── Social Media Illustration ───── */
function SocialMediaIllustration() {
    return <AnimatedMetricsShowcase />;
}

/* ── Jharokha Frame SVG (from jharokha-frame.svg — exact match) ─────── */
function JharokhaFrame() {
    return (
        <svg className="jharokha-frame" viewBox="0 0 378 378" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {/* Glassy white gradient for outer shape */}
                <radialGradient id="jf_glass_outer" cx="50%" cy="40%" r="55%" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="white" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                </radialGradient>

                {/* Glassy white gradient for inner shape */}
                <radialGradient id="jf_glass_inner" cx="50%" cy="45%" r="50%" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                </radialGradient>

                {/* Black-gray gradient for text */}
                <linearGradient id="jf_text_dark" x1="100" y1="165" x2="280" y2="210" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="50%" stopColor="#3a3a3a" />
                    <stop offset="100%" stopColor="#000000" />
                </linearGradient>

                {/* Soft white glow filter */}
                <filter id="jf_glow" x="-15%" y="-15%" width="130%" height="130%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Outer shape — frosted glass */}
            <g filter="url(#jf_glow)">
                <path d="M123.86 26.2409C164.789 27.1365 175.268 17.5536 188.612 0C201.24 18.1805 217.719 27.0469 241.989 26.2409C287.712 24.7224 299.397 52.7504 301.277 77.2001C345.878 77.2001 352.058 110.337 352.058 126.726C349.908 159.953 359.76 175.536 377.492 187.448C349.371 206.345 352.345 232.765 351.968 247.721C350.804 293.934 316.771 298.053 301.098 299.934C301.098 336.295 275.664 349.64 244.945 349.64C205.718 347.221 194.254 368.208 188.164 377.403C181.178 361.103 160.311 348.148 138.548 349.46C93.4104 352.181 77.2897 327.518 76.3045 299.218C37.1134 298.644 25.5244 271.812 25.5244 248.438C25.5244 208.315 16.5685 201.508 0 187.448C27.9425 166.491 23.2854 152.967 25.5244 121.622C27.5498 93.2658 48.8994 75.4089 77.4688 77.7375C76.4836 45.4961 95.1118 27.4051 123.86 26.2409Z" fill="url(#jf_glass_outer)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            </g>

            {/* Inner shape — deeper glass */}
            <path d="M137.678 60.6494C169.974 61.3561 178.242 53.7946 188.772 39.9435C198.736 54.2892 211.739 61.2854 230.89 60.6494C266.969 59.4512 276.189 81.5673 277.673 100.86C312.866 100.86 317.742 127.007 317.742 139.939C316.046 166.157 323.819 178.454 337.812 187.853C315.622 202.764 317.968 223.611 317.671 235.413C316.752 271.878 289.898 275.128 277.531 276.612C277.531 305.304 257.461 315.833 233.222 315.833C202.269 313.925 193.224 330.485 188.418 337.741C182.906 324.879 166.44 314.657 149.268 315.692C113.651 317.839 100.931 298.378 100.153 276.047C69.2289 275.595 60.0844 254.422 60.0844 235.978C60.0844 204.318 53.0175 198.948 39.9438 187.853C61.9924 171.316 58.3177 160.645 60.0844 135.911C61.6826 113.537 78.5289 99.4464 101.072 101.284C100.295 75.8431 114.994 61.5681 137.678 60.6494Z" fill="url(#jf_glass_inner)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />

            {/* Animated text labels in center — white */}
            <g className="jf-text-group">
                <text x="189" y="178" className="jf-text jf-text-1" textAnchor="middle" dominantBaseline="middle">Social Media</text>
                <text x="189" y="200" className="jf-text jf-text-1b" textAnchor="middle" dominantBaseline="middle">Management</text>

                <text x="189" y="178" className="jf-text jf-text-2" textAnchor="middle" dominantBaseline="middle">Brand Identity</text>
                <text x="189" y="200" className="jf-text jf-text-2b" textAnchor="middle" dominantBaseline="middle">Design</text>

                <text x="189" y="178" className="jf-text jf-text-3" textAnchor="middle" dominantBaseline="middle">Performance</text>
                <text x="189" y="200" className="jf-text jf-text-3b" textAnchor="middle" dominantBaseline="middle">Marketing</text>
            </g>
        </svg>
    );
}

/* ── Animated Stat Card Component ─────────────────────────────── */
function AnimatedStatCard({ stat, endValue, suffix = '', decimals = 0 }) {
    const [count, ref] = useCounterAnimation(endValue, 2000, 0);
    
    const displayValue = decimals > 0 
        ? count.toFixed(decimals) + suffix 
        : Math.floor(count) + suffix;
    
    return (
        <div className="stat-card" ref={ref}>
            <span className="stat-number">{displayValue}</span>
            <span className="stat-label">{stat.label}</span>
        </div>
    );
}

/* ── Component ───────────────────────────────────────────────── */

/* ── Meta-tag helper ── */
function setMetaTag(attr, attrValue, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setLinkTag(rel, href) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

export default function Home() {
    /* Service toggle state */
    const [activeService, setActiveService] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /* Progressive hero image: show webp instantly, swap to full PNG when loaded */
    const [heroLoaded, setHeroLoaded] = useState(false);
    useEffect(() => {
        const img = new Image();
        img.onload = () => setHeroLoaded(true);
        img.src = HeroBgFull;
    }, []);

    /* Trust logos from admin (API) */
    const [trustLogos, setTrustLogos] = useState([]);

    useEffect(() => {
        const fetchTrustLogos = async () => {
            try {
                const data = await api.getTrustLogos();
                if (Array.isArray(data) && data.length > 0) {
                    setTrustLogos(data);
                }
            } catch { /* ignore */ }
        };
        fetchTrustLogos();
    }, []);

    /* Case studies from admin (API) */
    const [adminCaseStudies, setAdminCaseStudies] = useState([]);
    useEffect(() => {
        const fetchCaseStudies = async () => {
            try {
                const data = await api.getCaseStudies();
                const published = data.filter(s => s.status === 'Published');
                if (published.length > 0) setAdminCaseStudies(published);
            } catch { }
        };
        fetchCaseStudies();
    }, []);

    /* Blog posts from admin + approved visitor blogs */
    const [adminBlogs, setAdminBlogs] = useState([]);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const [adminData, visitorData] = await Promise.all([
                    api.getBlogs(),
                    api.getVisitorBlogs({ status: 'approved' }).catch(() => []),
                ]);
                const published = (Array.isArray(adminData) ? adminData : []).filter(b => b.status === 'Published').map(b => ({
                    ...b,
                    slug: b.slug,
                    isVisitor: false,
}));
                const approved = (Array.isArray(visitorData) ? visitorData : []).map(b => ({
                    ...b,
                    slug: `visitor-${b._id}`,
                    isVisitor: true,
                }));
                setAdminBlogs([...published, ...approved]);
            } catch { }
        };
        fetchBlogs();
    }, []);

    /* Website settings from admin */
    const [footerCopyright, setFooterCopyright] = useState('');
    const [socialLinks, setSocialLinks] = useState({ instagram: '', linkedIn: '', twitter: '' });


    /* Read admin website settings and apply to <head> */
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const s = await api.getSettings();

                document.title = s.siteTitle || 'Noxtm Studio';

                setMetaTag('name', 'description', s.siteDescription);
                setMetaTag('name', 'keywords', s.metaKeywords);
                setMetaTag('property', 'og:title', s.ogTitle || s.siteTitle);
                setMetaTag('property', 'og:description', s.ogDescription || s.siteDescription);
                setMetaTag('property', 'og:image', s.ogImage);
                setMetaTag('name', 'twitter:card', s.twitterCard || 'summary_large_image');
                setMetaTag('name', 'twitter:title', s.ogTitle || s.siteTitle);
                setMetaTag('name', 'twitter:description', s.ogDescription || s.siteDescription);
                setMetaTag('name', 'robots', s.robotsMeta || 'index, follow');
                setLinkTag('canonical', s.canonicalUrl);

                if (s.footerCopyright) setFooterCopyright(s.footerCopyright);
                setSocialLinks({
                    instagram: s.socialInstagram || '',
                    linkedIn: s.socialLinkedIn || '',
                    twitter: s.socialTwitter || '',
                });
            } catch (_) { /* ignore */ }
        };
        fetchSettings();
    }, []);

    /* Scroll-triggered animations */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.12 }
        );
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="home">
            {/* ═══ Navbar ═══ */}
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo">
                        <span className="logo-text">Noxtm Studio</span>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/case-studies">Case Studies</a></li>
                        <li><a href="/work">Work</a></li>
                        <li><a href="/blog">Blogs</a></li>
                        <li className="nav-dropdown-parent">
                            <a href="#about" className="nav-dropdown-trigger">About <svg className="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                            <ul className="nav-dropdown">
                                <li><a href="/company">Company</a></li>
                                <li><a href="#about">Team</a></li>
                            </ul>
                        </li>
                    </ul>
                    <a href="/contact" className="nav-cta nav-cta-desktop">Contact</a>
                    <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </nav>
            </div>
            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <a href="/case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</a>
                <a href="/work" onClick={() => setMobileMenuOpen(false)}>Work</a>
                <a href="/blog" onClick={() => setMobileMenuOpen(false)}>Blogs</a>
                <a href="/company" onClick={() => setMobileMenuOpen(false)}>Company</a>
                <a href="/contact" className="mobile-menu-cta" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>

            {/* ═══ Full-Width Hero ═══ */}
            <section className="hero-rect">
                <div className="hero-rect-inner">
                    {/* Fast webp first, then full PNG when loaded */}
                    <img
                        src={HeroBgWebp}
                        alt=""
                        aria-hidden="true"
                        className="hero-bg-img"
                        style={{ opacity: heroLoaded ? 0 : 1 }}
                    />
                    <img
                        src={HeroBgFull}
                        alt=""
                        aria-hidden="true"
                        className="hero-bg-img"
                        style={{ opacity: heroLoaded ? 1 : 0 }}
                    />

                    {/* Film grain overlay */}
                    <div className="hero-grain" aria-hidden="true" />

                    {/* Left: Text */}
                    <div className="hero-rect-left">
                        {/* Decorative flourish ornament from ddsign!.svg */}
                        <svg className="hero-ornament-svg" viewBox="0 0 324 51" fill="none">
                            <path d="M0 51V49C26.3333 47.8333 118.5 49 118.5 49C149.5 51 153.667 30.1667 151 19.5C145.5 -0.5 125 2 120 11C113 21 119.333 28.5 123.5 30.5C134.3 34.1 140.5 21 134 19C128.657 17.356 131 26.5 131 26.5C125.8 25.3 124.167 21 124 19C124 14.5 128 11 132 11C136 11 143 14.5 143 23C143 31.5 135 35.5 131 35.5C120 35.5 115.539 28.2349 114.5 22C113 13 120.5 2 132 2C146.5 2 153.208 13.5 154 23C155.5 41 142 51 127 51H0Z" fill="currentColor" />
                            <path d="M323.114 49V47C296.781 45.8333 204.614 47 204.614 47C173.614 49 169.448 28.1667 172.114 17.5C177.614 -2.5 198.114 0 203.114 9C210.114 19 203.781 26.5 199.614 28.5C188.814 32.1 182.614 19 189.114 17C194.457 15.356 192.114 24.5 192.114 24.5C197.314 23.3 198.948 19 199.114 17C199.114 12.5 195.114 9 191.114 9C187.114 9 180.114 12.5 180.114 21C180.114 29.5 188.114 33.5 192.114 33.5C203.114 33.5 207.575 26.2349 208.614 20C210.114 11 202.614 0 191.114 0C176.614 0 169.906 11.5 169.114 21C167.614 39 181.114 49 196.114 49H323.114Z" fill="currentColor" />
                            <path d="M111 32.5C116.2 38.9 129.833 39.5 136 39L135.5 41C132.7 42.2 114.333 42.1667 105.5 42C105.167 36.1667 111 32.5 111 32.5Z" fill="currentColor" />
                            <path d="M212.114 30.5C206.914 36.9 193.281 37.5 187.114 37L187.614 39C190.414 40.2 208.781 40.1667 217.614 40C217.948 34.1667 212.114 30.5 212.114 30.5Z" fill="currentColor" />
                            <path d="M103 19C103 25 106.333 29.1667 108.499 31L107.111 32.6136C87.9999 20 90.8888 3.88643 98.5 6C104.389 7.6353 103 11.5 103 19Z" fill="currentColor" />
                            <path d="M220.115 17C220.115 23 216.781 27.1667 214.615 29L216.003 30.6136C235.114 18 232.225 1.88643 224.614 4C218.725 5.6353 220.115 9.5 220.115 17Z" fill="currentColor" />
                            <path d="M76.8611 18.184C85.8615 25.184 97.3333 31.1667 105 34.5L103.5 36C100.7 36.4 88 34 81.8607 31.684C72.8607 28.684 61.8608 20.684 64.3606 14.684C67.2449 7.76083 73.8615 16.184 76.8611 18.184Z" fill="currentColor" />
                            <path d="M246.253 16.184C237.253 23.184 225.781 29.1667 218.114 32.5L219.614 34C222.414 34.4 235.114 32 241.254 29.684C250.254 26.684 261.253 18.684 258.754 12.684C255.869 5.76083 249.253 14.184 246.253 16.184Z" fill="currentColor" />
                            <path d="M104 42V40C81.9993 39.2 44 27.5 33.9998 27C27.5 26.5 25.0001 36 36.4998 38C57.0602 41.5759 89.9998 42.5 104 42Z" fill="currentColor" />
                            <path d="M219.115 40V38C241.115 37.2 279.114 25.5 289.114 25C295.614 24.5 298.114 34 286.614 36C266.054 39.5759 233.115 40.5 219.115 40Z" fill="currentColor" />
                        </svg>

                        <span className="badge">Social Media Agency in India</span>

                        <h1 className="hero-rect-title">
                            <span className="hero-title-line1">Master of</span>
                            <span className="hero-rect-accent">Marketing &amp; Management</span>
                        </h1>

                        <div className="hero-actions">
                            <a href="#services" className="btn-primary">Creative Work</a>
                            <a href="#contact" className="btn-ghost">Let's Connect</a>
                        </div>
                    </div>

                    {/* Right: Jharokha Frame */}
                    <div className="hero-rect-right">
                        <JharokhaFrame />
                    </div>
                </div>
            </section>

            {/* ═══ Trust Bar ═══ */}
            <section className="trust-bar animate-on-scroll">
                <p className="trust-label">TRUSTED BY INDIA'S TOP BRANDS</p>
                <div className="trust-marquee-container">
                    <div className="trust-marquee-track">
                        {/* First set */}
                        {(trustLogos.length > 0 ? trustLogos : TRUST_LOGOS.map((t, i) => ({ id: i, name: t, imageUrl: '' }))).map((logo, idx) => (
                            <span className="trust-logo-item" key={`a-${logo.id || idx}`}>
                                {logo.imageUrl ? <img src={logo.imageUrl} alt={logo.name} className="trust-logo-img" /> : logo.name}
                            </span>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {(trustLogos.length > 0 ? trustLogos : TRUST_LOGOS.map((t, i) => ({ id: i, name: t, imageUrl: '' }))).map((logo, idx) => (
                            <span className="trust-logo-item" key={`b-${logo.id || idx}`}>
                                {logo.imageUrl ? <img src={logo.imageUrl} alt={logo.name} className="trust-logo-img" /> : logo.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Services Section ═══ */}
            <section className="services-section" id="services">
                <div className="section-header animate-on-scroll">
                    <svg className="hero-ornament-svg" viewBox="0 0 324 51" fill="none" style={{width:'220px',margin:'0 auto 0.75rem',display:'block',color:'var(--text-muted)'}}>
                        <path d="M0 51V49C26.3333 47.8333 118.5 49 118.5 49C149.5 51 153.667 30.1667 151 19.5C145.5 -0.5 125 2 120 11C113 21 119.333 28.5 123.5 30.5C134.3 34.1 140.5 21 134 19C128.657 17.356 131 26.5 131 26.5C125.8 25.3 124.167 21 124 19C124 14.5 128 11 132 11C136 11 143 14.5 143 23C143 31.5 135 35.5 131 35.5C120 35.5 115.539 28.2349 114.5 22C113 13 120.5 2 132 2C146.5 2 153.208 13.5 154 23C155.5 41 142 51 127 51H0Z" fill="currentColor" />
                        <path d="M323.114 49V47C296.781 45.8333 204.614 47 204.614 47C173.614 49 169.448 28.1667 172.114 17.5C177.614 -2.5 198.114 0 203.114 9C210.114 19 203.781 26.5 199.614 28.5C188.814 32.1 182.614 19 189.114 17C194.457 15.356 192.114 24.5 192.114 24.5C197.314 23.3 198.948 19 199.114 17C199.114 12.5 195.114 9 191.114 9C187.114 9 180.114 12.5 180.114 21C180.114 29.5 188.114 33.5 192.114 33.5C203.114 33.5 207.575 26.2349 208.614 20C210.114 11 202.614 0 191.114 0C176.614 0 169.906 11.5 169.114 21C167.614 39 181.114 49 196.114 49H323.114Z" fill="currentColor" />
                        <path d="M111 32.5C116.2 38.9 129.833 39.5 136 39L135.5 41C132.7 42.2 114.333 42.1667 105.5 42C105.167 36.1667 111 32.5 111 32.5Z" fill="currentColor" />
                        <path d="M212.114 30.5C206.914 36.9 193.281 37.5 187.114 37L187.614 39C190.414 40.2 208.781 40.1667 217.614 40C217.948 34.1667 212.114 30.5 212.114 30.5Z" fill="currentColor" />
                        <path d="M103 19C103 25 106.333 29.1667 108.499 31L107.111 32.6136C87.9999 20 90.8888 3.88643 98.5 6C104.389 7.6353 103 11.5 103 19Z" fill="currentColor" />
                        <path d="M220.115 17C220.115 23 216.781 27.1667 214.615 29L216.003 30.6136C235.114 18 232.225 1.88643 224.614 4C218.725 5.6353 220.115 9.5 220.115 17Z" fill="currentColor" />
                        <path d="M76.8611 18.184C85.8615 25.184 97.3333 31.1667 105 34.5L103.5 36C100.7 36.4 88 34 81.8607 31.684C72.8607 28.684 61.8608 20.684 64.3606 14.684C67.2449 7.76083 73.8615 16.184 76.8611 18.184Z" fill="currentColor" />
                        <path d="M246.253 16.184C237.253 23.184 225.781 29.1667 218.114 32.5L219.614 34C222.414 34.4 235.114 32 241.254 29.684C250.254 26.684 261.253 18.684 258.754 12.684C255.869 5.76083 249.253 14.184 246.253 16.184Z" fill="currentColor" />
                        <path d="M104 42V40C81.9993 39.2 44 27.5 33.9998 27C27.5 26.5 25.0001 36 36.4998 38C57.0602 41.5759 89.9998 42.5 104 42Z" fill="currentColor" />
                        <path d="M219.115 40V38C241.115 37.2 279.114 25.5 289.114 25C295.614 24.5 298.114 34 286.614 36C266.054 39.5759 233.115 40.5 219.115 40Z" fill="currentColor" />
                    </svg>
                    <h2 className="section-title saudagar-text">Grow Faster. Stay Rooted.</h2>
                </div>

                {/* Glass toggle bar */}
                <div className="service-toggle-bar animate-on-scroll">
                    {SERVICES.map((service, i) => (
                        <button
                            key={service.title}
                            className={`service-toggle-btn ${i === activeService ? 'active' : ''}`}
                            onClick={() => setActiveService(i)}
                        >
                            {service.title}
                        </button>
                    ))}
                    {/* Sliding active indicator */}
                    <div
                        className="toggle-active-bg"
                        style={{ transform: `translateX(${activeService * 100}%)`, width: `calc((100% - 12px) / ${SERVICES.length})` }}
                    />
                </div>

                {/* Active service display */}
                {(() => {
                    const service = SERVICES[activeService];
                    const gradientMap = {
                        'gradient-saffron': 'linear-gradient(135deg, #E8804A 0%, #D4622B 50%, #C4532A 100%)',
                        'gradient-blue': 'linear-gradient(135deg, #222222 0%, #000000 50%, #111111 100%)',
                        'gradient-emerald': 'linear-gradient(135deg, #34A572 0%, #2A8C5E 50%, #1E7A4F 100%)',
                    };

                    /* Social Media Management uses the showcase design */
                    const isSocialMedia = activeService === 0;
                    const isPerformance = activeService === 1;
                    const isGraphicDesign = activeService === 2;

                    return (
                        <div className={`service-card-display service-fade-in ${(isSocialMedia || isPerformance || isGraphicDesign) ? 'sm-showcase-layout' : ''}`} key={activeService}>
                            {isSocialMedia ? (
                                <div className="sm-showcase">
                                    {/* Concentric semi-circle arches */}
                                    <img src={ArchOuter} alt="" className="sm-arch sm-arch-outer" />
                                    <img src={ArchMid} alt="" className="sm-arch sm-arch-mid" />
                                    <img src={ArchInner} alt="" className="sm-arch sm-arch-inner" />

                                    {/* Circular avatar photos with social icons */}
                                    <img src={AvatarIG} alt="Instagram" className="sm-avatar sm-avatar-ig" />
                                    <img src={AvatarLI} alt="LinkedIn" className="sm-avatar sm-avatar-li" />
                                    <img src={AvatarX} alt="X" className="sm-avatar sm-avatar-x" />

                                    {/* Stat badges */}
                                    <img src={BadgeViews} alt="Post views" className="sm-badge sm-badge-views" />
                                    <img src={BadgeGrowth} alt="Focus Growth" className="sm-badge sm-badge-growth" />

                                    {/* Center text */}
                                    <div className="sm-center-text">
                                        <MilestoneCounter />
                                        <span className="sm-followers-label">Followers</span>
                                    </div>
                                </div>
                            ) : isPerformance ? (
                                <div className="pm-showcase">
                                    {/* White inner box with jharokha arch */}
                                    <div className="pm-inner-box">
                                        {/* Purple gradient cloud blob */}
                                        <div className="pm-cloud-blob" />

                                        {/* Jharokha half-arch */}
                                        <div className="pm-jharokha">
                                            <svg viewBox="0 0 378 189" fill="none" className="pm-jharokha-svg" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <radialGradient id="pmjf_inner_grad" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
                                                        <stop offset="0%" stopColor="#ffffff" />
                                                        <stop offset="55%" stopColor="#edf5ed" />
                                                        <stop offset="100%" stopColor="#d8e8d8" />
                                                    </radialGradient>
                                                    <filter id="pmjf_outer" x="0" y="0" width="377.493" height="377.403" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                        <feOffset />
                                                        <feGaussianBlur stdDeviation="22.3898" />
                                                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                        <feColorMatrix type="matrix" values="0 0 0 0 0.106 0 0 0 0 0.212 0 0 0 0 0.102 0 0 0 0.3 0" />
                                                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                                                    </filter>
                                                    <filter id="pmjf_inner" x="39.9438" y="39.9435" width="297.868" height="297.797" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                        <feOffset />
                                                        <feComposite in2="hardAlpha" operator="out" />
                                                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.96 0" />
                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                        <feOffset />
                                                        <feGaussianBlur stdDeviation="17.6671" />
                                                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                        <feColorMatrix type="matrix" values="0 0 0 0 0.106 0 0 0 0 0.212 0 0 0 0 0.102 0 0 0 0.25 0" />
                                                        <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
                                                    </filter>
                                                </defs>

                                                {/* Outer shape — green-tinted #d8e8d8 */}
                                                <g filter="url(#pmjf_outer)">
                                                    <path d="M123.86 26.2409C164.789 27.1365 175.268 17.5536 188.612 0C201.24 18.1805 217.719 27.0469 241.989 26.2409C287.712 24.7224 299.397 52.7504 301.277 77.2001C345.878 77.2001 352.058 110.337 352.058 126.726C349.908 159.953 359.76 175.536 377.492 187.448C349.371 206.345 352.345 232.765 351.968 247.721C350.804 293.934 316.771 298.053 301.098 299.934C301.098 336.295 275.664 349.64 244.945 349.64C205.718 347.221 194.254 368.208 188.164 377.403C181.178 361.103 160.311 348.148 138.548 349.46C93.4104 352.181 77.2897 327.518 76.3045 299.218C37.1134 298.644 25.5244 271.812 25.5244 248.438C25.5244 208.315 16.5685 201.508 0 187.448C27.9425 166.491 23.2854 152.967 25.5244 121.622C27.5498 93.2658 48.8994 75.4089 77.4688 77.7375C76.4836 45.4961 95.1118 27.4051 123.86 26.2409Z" fill="#d8e8d8" />
                                                </g>

                                                {/* Inner shape — radial gradient white→lavender */}
                                                <g filter="url(#pmjf_inner)">
                                                    <path d="M137.678 60.6494C169.974 61.3561 178.242 53.7946 188.772 39.9435C198.736 54.2892 211.739 61.2854 230.89 60.6494C266.969 59.4512 276.189 81.5673 277.673 100.86C312.866 100.86 317.742 127.007 317.742 139.939C316.046 166.157 323.819 178.454 337.812 187.853C315.622 202.764 317.968 223.611 317.671 235.413C316.752 271.878 289.898 275.128 277.531 276.612C277.531 305.304 257.461 315.833 233.222 315.833C202.269 313.925 193.224 330.485 188.418 337.741C182.906 324.879 166.44 314.657 149.268 315.692C113.651 317.839 100.931 298.378 100.153 276.047C69.2289 275.595 60.0844 254.422 60.0844 235.978C60.0844 204.318 53.0175 198.948 39.9438 187.853C61.9924 171.316 58.3177 160.645 60.0844 135.911C61.6826 113.537 78.5289 99.4464 101.072 101.284C100.295 75.8431 114.994 61.5681 137.678 60.6494Z" fill="url(#pmjf_inner_grad)" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Floating cards OUTSIDE the box */}
                                    {/* $0 → $50K stat card — left side */}
                                    <div className="pm-stat-card pm-stat-revenue">
                                        <div className="pm-stat-main">
                                            <span className="pm-stat-dollar">$0</span>
                                            <span className="pm-stat-arrow">→</span>
                                            <span className="pm-stat-dollar">$50K</span>
                                        </div>
                                        <span className="pm-stat-sub">in 90 Days</span>
                                        <div className="pm-roi-badge">
                                            <span>300% ROI</span>
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 10L7 3L11 6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Company Growth card — right side */}
                                    <div className="pm-growth-card">
                                        <div className="pm-growth-header">
                                            <span className="pm-growth-label">Company Growth</span>
                                            <span className="pm-growth-pct">76%</span>
                                        </div>
                                        <div className="pm-growth-bar-bg">
                                            <div className="pm-growth-bar-fill" />
                                        </div>
                                    </div>

                                    {/* Notification card */}
                                    <div className="pm-notif-card">
                                        <div className="pm-notif-icon">
                                            <span className="pm-notif-icon-text">NOXTM<br />STUDIO</span>
                                        </div>
                                        <div className="pm-notif-body">
                                            <div className="pm-notif-top">
                                                <span className="pm-notif-name">Noxtm Studio</span>
                                                <span className="pm-notif-time">Nov, 08:36 PM</span>
                                            </div>
                                            <p className="pm-notif-msg">Congratulations, you have a new order totaling ₹4,999.<br />Invoice no: JISO039089-00289-09902 from your website.</p>
                                        </div>
                                    </div>

                                    {/* Meta logo — bottom left */}
                                    <div className="pm-logo pm-logo-meta">
                                        <div className="pm-meta-glass-circle" />
                                        <img src={MetaLogo} alt="Meta" />
                                    </div>

                                    {/* Google Ads logo — bottom right */}
                                    <div className="pm-logo pm-logo-gads">
                                        <div className="pm-gads-glass-circle" />
                                        <img src={GoogleAds} alt="Google Ads" />
                                    </div>
                                </div>
                            ) : isGraphicDesign ? (
                                <div className="gd-showcase">
                                    {/* Big bold typography */}
                                    <div className="gd-text-block">
                                        <span className="gd-line1">
                                            <span className="gd-selection-box">Always</span> Think
                                        </span>
                                        <span className="gd-line2">Outside the box</span>
                                    </div>

                                    {/* Floating collaborative cursors */}
                                    <div className="gd-cursor gd-cursor-mae">
                                        <svg className="gd-cursor-arrow" width="14" height="17" viewBox="0 0 14 17" fill="none">
                                            <path d="M0.5 0.5L13 9.5H5.5L2.5 16.5L0.5 0.5Z" fill="#22C55E" stroke="#16A34A" strokeWidth="0.5"/>
                                        </svg>
                                        <span className="gd-cursor-label gd-cursor-label-green">Mae</span>
                                    </div>

                                    <div className="gd-cursor gd-cursor-tony">
                                        <svg className="gd-cursor-arrow" width="14" height="17" viewBox="0 0 14 17" fill="none">
                                            <path d="M0.5 0.5L13 9.5H5.5L2.5 16.5L0.5 0.5Z" fill="#6366F1" stroke="#4F46E5" strokeWidth="0.5"/>
                                        </svg>
                                        <span className="gd-cursor-label gd-cursor-label-blue">Noxtm Studio</span>
                                    </div>

                                    <div className="gd-cursor gd-cursor-luis">
                                        <svg className="gd-cursor-arrow" width="14" height="17" viewBox="0 0 14 17" fill="none">
                                            <path d="M0.5 0.5L13 9.5H5.5L2.5 16.5L0.5 0.5Z" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5"/>
                                        </svg>
                                        <span className="gd-cursor-label gd-cursor-label-red">Luis</span>
                                    </div>
                                </div>
                            ) : null}
                            <div className="service-detail">
                                <span className="service-hindi">{service.hindi}</span>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <div className="service-tags">
                                    {service.tags.map((tag) => (
                                        <span className="pill-tag" key={tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </section>

            <RangoliDivider />

            {/* ═══ Work / Case Studies Section ═══ */}
            <section className="work-section" id="work">
                {/* Blog strip */}
                <div className="blog-strip animate-on-scroll">
                    {adminBlogs.length > 0 ? adminBlogs.map((item, i) => (
                        <a href={`/blog/${item.slug}`} className="blog-chip" key={i}>
                            <span className="blog-chip-thumb" style={{ background: item.featureImage ? `url(${item.featureImage}) center/cover no-repeat` : '#000000' }} />
                            <div className="blog-chip-text">
                                <span className="blog-chip-title">{item.title}</span>
                                <span className="blog-chip-source">{item.isVisitor ? 'Community' : (item.category || 'From our blog')}</span>
                            </div>
                        </a>
                    )) : (
                        <a href="/blog" className="blog-chip">
                            <span className="blog-chip-thumb" style={{ background: 'linear-gradient(135deg, #E8722A, #F5A623)' }} />
                            <div className="blog-chip-text">
                                <span className="blog-chip-title">Explore Our Blog</span>
                                <span className="blog-chip-source">Insights & strategies</span>
                            </div>
                        </a>
                    )}
                </div>

                {/* Case study cards */}
                <div className="case-study-wrapper animate-on-scroll">
                    {(adminCaseStudies.length > 0 ? adminCaseStudies.slice(0, 5) : CASE_STUDIES).map((cs, i) => (
                        <div className="case-study-card" key={cs.id || i}>
                            <div
                                className="case-study-visual"
                                style={{
                                    background: cs.featureImage
                                        ? `url(${cs.featureImage}) center/cover no-repeat`
                                        : cs.gradient || `linear-gradient(180deg, ${cs.gradientStart || '#6366F1'} 0%, ${cs.gradientEnd || '#E8722A'} 100%)`,
                                }}
                            />
                            <div className="case-study-overlay">
                                <h4 className="case-study-title">{cs.title}</h4>
                                <p className="case-study-subtitle">{cs.subtitle || cs.category || ''}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <RangoliDivider />

            {/* ═══ Testimonial Section ═══ */}
            <section className="testimonial-section animate-on-scroll">
                <div className="section-header">
                    <p className="section-label">प्रशंसापत्र · TESTIMONIALS</p>
                    <h2 className="section-title">What Our Clients Say</h2>
                </div>
                {TESTIMONIALS.map((t) => (
                    <div className="testimonial-card" key={t.name}>
                        <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
                        <div className="testimonial-footer">
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                                <div>
                                    <p className="testimonial-name">{t.name}</p>
                                    <p className="testimonial-role">{t.role}</p>
                                </div>
                            </div>
                            <a href="#contact" className="btn-ghost btn-sm">Read Case Study</a>
                        </div>
                    </div>
                ))}
            </section>

            {/* ═══ Blog / Updates ═══ */}
            <section className="updates-section animate-on-scroll">
                <div className="section-header">
                    <p className="section-label">अपडेट · UPDATES</p>
                    <h2 className="section-title">Research & Insights</h2>
                </div>
                <div className="updates-grid">
                    {adminBlogs.length > 0 ? adminBlogs.map((b) => (
                        <a href={`/blog/${b.slug}`} className="update-card" key={b._id || b.id} style={{ textDecoration: 'none' }}>
                            <div
                                className="update-card-image"
                                style={{
                                    background: b.featureImage
                                        ? `url(${b.featureImage}) center/cover no-repeat`
                                        : 'linear-gradient(135deg, #000000 0%, #222222 100%)'
                                }}
                            />
                            <div className="update-card-body">
                                <span className="update-category">{b.category || 'BLOG'}</span>
                                <h3 className="update-title">{b.title}</h3>
                                <span className="update-date">{b.publishDate || b.createdAt || ''}</span>
                            </div>
                        </a>
                    )) : (
                        <a href="/blog" className="update-card" style={{ textDecoration: 'none' }}>
                            <div className="update-card-image" style={{ background: 'linear-gradient(135deg, #131313 0%, #3D3D3D 100%)' }} />
                            <div className="update-card-body">
                                <span className="update-category">BLOG</span>
                                <h3 className="update-title">Visit our blog for the latest insights on digital marketing and social media</h3>
                                <span className="update-date">Explore now →</span>
                            </div>
                        </a>
                    )}
                </div>
            </section>

            {/* ═══ Final CTA + Grass Scene (merged) ═══ */}
            <section className="cta-section animate-on-scroll animate-in" id="contact">
                {/* Text sits BEHIND the footer image */}
                <div className="cta-text-bg">
                    <h2 className="txt-cta-heading">
                        We turn scrolls into sales.<br />Your social media growth partner.
                    </h2>
                </div>
                {/* Footer image sits ON TOP of text, transparent areas reveal it */}
                <img src={FootersBg} className="cta-footer-img" alt="" />
                {/* Button floats ABOVE the footer image */}
                <div className="cta-btn-row">
                    <a href="/contact" className="btn-primary btn-sm cta-connect-btn">Let’s Connect ✦</a>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <Footer />
        </div>
    );
}

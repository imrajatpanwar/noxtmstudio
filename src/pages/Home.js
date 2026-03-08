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

/* ── Grass Scene (above footer) ──────────────────────────────── */
function GrassScene() {
    return (
        <div className="grass-scene">
            {/* Back layer — tallest, darkest */}
            <svg className="grass-layer grass-back" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grassBack" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a3a1a" />
                        <stop offset="100%" stopColor="#1e4d1e" />
                    </linearGradient>
                </defs>
                <path d="M-5,320 C-8,236 -1,150 6,70 C10,84 5,144 -2,320Z" fill="#1d431d" />
                <path d="M27,320 C22,216 29,105 39,28 C41,43 37,114 30,320Z" fill="#1d431d" />
                <path d="M56,320 C55,243 58,166 71,69 C73,97 68,129 59,320Z" fill="#1a3a1a" />
                <path d="M75,320 C73,215 77,125 86,28 C89,58 86,115 79,320Z" fill="#1d431d" />
                <path d="M103,320 L103,288 C93,212 96,69 90,41 C98,72 106,208 109,288 L109,320Z" fill="#1d431d" />
                <path d="M126,320 L126,278 C122,199 129,102 130,72 C135,94 137,219 135,278 L135,320Z" fill="#1a3a1a" />
                <path d="M165,320 C156,239 154,131 149,50 C152,75 169,156 167,320Z" fill="#1a3a1a" />
                <path d="M183,320 L183,285 C181,169 191,48 199,25 C205,41 201,192 190,285 L190,320Z" fill="#1d431d" />
                <path d="M210,320 L210,276 C202,230 208,86 209,68 C216,90 221,202 219,276 L219,320Z" fill="#1a3a1a" />
                <path d="M232,320 C225,252 220,148 218,53 C222,83 235,153 235,320Z" fill="#1e4d1e" />
                <path d="M256,320 L256,290 C248,201 254,95 255,73 C260,103 269,198 264,290 L264,320Z" fill="#1d431d" />
                <path d="M293,320 L293,267 C284,195 292,36 296,25 C304,53 308,188 300,267 L300,320Z" fill="#1d431d" />
                <path d="M320,320 C312,223 312,132 313,49 C316,69 326,126 323,320Z" fill="#1e4d1e" />
                <path d="M340,320 C333,239 331,128 327,36 C330,54 343,127 343,320Z" fill="#1e4d1e" />
                <path d="M363,320 C358,228 359,160 359,76 C361,88 368,163 366,320Z" fill="#1d431d" />
                <path d="M389,320 L389,295 C381,189 392,61 398,36 C407,57 406,218 398,295 L398,320Z" fill="#1a3a1a" />
                <path d="M414,320 L414,292 C404,211 408,80 407,60 C413,89 424,196 422,292 L422,320Z" fill="#1d431d" />
                <path d="M442,320 L442,264 Q442,101 462,46 Q465,141 460,264 L460,320Z" fill="#1d431d" />
                <path d="M465,320 C462,221 465,141 473,65 C476,95 475,153 468,320Z" fill="#1a3a1a" />
                <path d="M502,320 C495,207 490,110 487,31 C491,56 507,108 506,320Z" fill="#1a3a1a" />
                <path d="M524,320 C517,224 521,176 526,61 C528,84 531,131 527,320Z" fill="#1e4d1e" />
                <path d="M552,320 C550,220 552,151 559,44 C563,58 564,100 556,320Z" fill="#1e4d1e" />
                <path d="M555,320 C546,235 542,171 538,67 C540,81 560,145 559,320Z" fill="#1d431d" />
                <path d="M557,320 C549,245 552,123 551,51 C555,88 562,135 561,320Z" fill="#1e4d1e" />
                <path d="M558,320 C554,190 588,39 593,31 C594,47 588,189 560,320Z" fill="#1e4d1e" />
                <path d="M580,320 L580,285 Q574,109 576,73 Q592,168 594,285 L594,320Z" fill="#1a3a1a" />
                <path d="M596,320 C589,238 593,129 598,58 C602,87 602,134 599,320Z" fill="#1a3a1a" />
                <path d="M626,320 C622,227 633,110 645,20 C648,63 639,99 628,320Z" fill="#1e4d1e" />
                <path d="M626,320 L626,284 Q633,107 648,65 Q647,134 642,284 L642,320Z" fill="#1d431d" />
                <path d="M629,320 L629,281 Q629,127 630,77 Q648,156 645,281 L645,320Z" fill="#1e4d1e" />
                <path d="M630,320 C625,237 634,164 642,57 C645,87 642,116 633,320Z" fill="#1a3a1a" />
                <path d="M636,320 C637,236 641,147 652,30 C654,70 648,92 638,320Z" fill="#1e4d1e" />
                <path d="M649,320 C635,182 641,74 636,58 C638,74 654,210 651,320Z" fill="#1d431d" />
                <path d="M686,320 L686,272 Q690,112 707,44 Q707,102 702,272 L702,320Z" fill="#1a3a1a" />
                <path d="M706,320 L706,264 Q704,106 700,21 Q716,124 720,264 L720,320Z" fill="#1e4d1e" />
                <path d="M733,320 L733,269 C729,186 738,60 741,39 C749,69 748,231 741,269 L741,320Z" fill="#1e4d1e" />
                <path d="M758,320 C756,220 757,141 765,57 C767,74 769,110 762,320Z" fill="#1e4d1e" />
                <path d="M781,320 C766,181 789,29 781,23 C783,40 793,177 783,320Z" fill="#1e4d1e" />
                <path d="M804,320 C797,249 803,111 805,39 C806,60 809,139 806,320Z" fill="#1e4d1e" />
                <path d="M830,320 L830,268 Q826,93 828,56 Q843,115 846,268 L846,320Z" fill="#1e4d1e" />
                <path d="M872,320 C867,246 861,115 860,26 C863,56 875,105 876,320Z" fill="#1a3a1a" />
                <path d="M897,320 C894,249 900,134 910,48 C912,69 906,126 899,320Z" fill="#1e4d1e" />
                <path d="M921,320 L921,281 C919,194 932,46 939,29 C944,62 941,196 930,281 L930,320Z" fill="#1a3a1a" />
                <path d="M944,320 L944,294 C936,200 932,84 931,60 C935,81 947,216 951,294 L951,320Z" fill="#1d431d" />
                <path d="M967,320 L967,284 C960,210 974,57 978,40 C982,63 983,191 975,284 L975,320Z" fill="#1d431d" />
                <path d="M970,320 L970,292 C962,177 968,85 974,59 C980,81 986,214 978,292 L978,320Z" fill="#1e4d1e" />
                <path d="M973,320 C968,223 973,174 979,71 C981,99 980,147 976,320Z" fill="#1a3a1a" />
                <path d="M974,320 C971,246 979,166 996,58 C998,95 990,114 978,320Z" fill="#1d431d" />
                <path d="M997,320 C985,148 999,39 997,23 C1001,32 1009,224 998,320Z" fill="#1e4d1e" />
                <path d="M1019,320 L1019,295 C1018,227 1030,76 1042,66 C1046,100 1039,197 1027,295 L1027,320Z" fill="#1a3a1a" />
                <path d="M1045,320 C1038,230 1037,109 1033,27 C1035,46 1048,86 1048,320Z" fill="#1e4d1e" />
                <path d="M1070,320 C1068,251 1071,157 1082,49 C1085,67 1080,147 1072,320Z" fill="#1a3a1a" />
                <path d="M1097,320 C1098,234 1104,135 1115,63 C1116,76 1107,133 1099,320Z" fill="#1a3a1a" />
                <path d="M1128,320 C1123,246 1123,122 1121,33 C1123,61 1134,96 1131,320Z" fill="#1a3a1a" />
                <path d="M1137,320 L1137,286 C1133,210 1137,92 1141,70 C1146,92 1151,218 1145,286 L1145,320Z" fill="#1a3a1a" />
                <path d="M1138,320 L1138,263 Q1134,76 1133,26 Q1151,74 1156,263 L1156,320Z" fill="#1e4d1e" />
                <path d="M1138,320 C1136,225 1143,170 1154,50 C1158,75 1146,120 1140,320Z" fill="#1e4d1e" />
                <path d="M1144,320 L1144,277 C1139,175 1142,46 1149,35 C1158,64 1156,196 1154,277 L1154,320Z" fill="#1d431d" />
                <path d="M1150,320 L1150,276 C1141,211 1148,93 1154,74 C1163,91 1163,228 1158,276 L1158,320Z" fill="#1d431d" />
                <path d="M1171,320 C1170,238 1173,114 1181,33 C1183,51 1180,108 1173,320Z" fill="#1a3a1a" />
                <path d="M1205,320 L1205,297 C1197,195 1201,93 1197,71 C1204,90 1212,232 1211,297 L1211,320Z" fill="#1d431d" />
                <path d="M1225,320 L1225,289 C1222,203 1227,77 1230,55 C1236,88 1240,228 1235,289 L1235,320Z" fill="#1e4d1e" />
                <path d="M1256,320 C1248,242 1252,181 1253,67 C1255,83 1264,132 1259,320Z" fill="#1d431d" />
                <path d="M1280,320 C1279,211 1284,118 1294,45 C1298,61 1289,136 1282,320Z" fill="#1a3a1a" />
                <path d="M1284,320 L1284,292 C1276,208 1287,51 1289,33 C1298,60 1298,228 1294,292 L1294,320Z" fill="#1a3a1a" />
                <path d="M1284,320 C1275,228 1278,153 1276,20 C1278,43 1288,120 1287,320Z" fill="#1d431d" />
                <path d="M1290,320 L1290,267 Q1294,120 1315,77 Q1309,137 1305,267 L1305,320Z" fill="#1a3a1a" />
                <path d="M1304,320 C1298,157 1304,57 1304,38 C1305,51 1316,223 1306,320Z" fill="#1a3a1a" />
                <path d="M1328,320 L1328,298 C1325,185 1329,84 1332,66 C1341,91 1342,197 1336,298 L1336,320Z" fill="#1a3a1a" />
                <path d="M1369,320 L1369,287 Q1371,105 1376,47 Q1388,115 1383,287 L1383,320Z" fill="#1e4d1e" />
                <path d="M1372,320 C1365,234 1370,151 1374,68 C1377,95 1378,154 1375,320Z" fill="#1a3a1a" />
                <path d="M1373,320 L1373,292 C1369,182 1379,81 1390,56 C1397,89 1392,238 1383,292 L1383,320Z" fill="#1e4d1e" />
                <path d="M1373,320 L1373,282 C1369,209 1372,94 1377,75 C1382,97 1385,220 1381,282 L1381,320Z" fill="#1e4d1e" />
                <path d="M1375,320 C1367,220 1371,150 1371,45 C1373,74 1382,104 1377,320Z" fill="#1e4d1e" />
                <path d="M1380,320 L1380,295 C1372,229 1377,81 1375,69 C1382,99 1394,218 1390,295 L1390,320Z" fill="#1d431d" />
                <path d="M1381,320 L1381,277 Q1379,74 1387,24 Q1395,110 1395,277 L1395,320Z" fill="#1e4d1e" />
                <path d="M1388,320 C1388,220 1390,173 1402,66 C1404,85 1401,151 1392,320Z" fill="#1d431d" />
                <path d="M1407,320 C1404,225 1414,164 1425,54 C1427,69 1421,124 1411,320Z" fill="#1e4d1e" />
                <rect x="0" y="200" width="1440" height="120" fill="#1a3a1a" />
            </svg>

            {/* Mid layer + sunflowers */}
            <svg className="grass-layer grass-mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grassMid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#276227" />
                        <stop offset="100%" stopColor="#2d7a2d" />
                    </linearGradient>
                </defs>
                <path d="M-5,320 L-5,296 C-11,200 -12,95 -16,79 C-10,98 4,235 3,296 L3,320Z" fill="#2a6e2a" />
                <path d="M24,320 L24,292 C19,231 31,115 40,99 C46,132 39,231 31,292 L31,320Z" fill="#2d7a2d" />
                <path d="M51,320 L51,293 C44,193 57,103 64,78 C70,104 68,238 58,293 L58,320Z" fill="#276227" />
                <path d="M84,320 C81,262 83,209 86,119 C88,139 92,173 87,320Z" fill="#2a6e2a" />
                <path d="M85,320 C77,236 82,182 86,105 C88,116 91,148 87,320Z" fill="#276227" />
                <path d="M92,320 C91,224 92,177 104,73 C108,101 106,124 96,320Z" fill="#2d7a2d" />
                <path d="M94,320 C94,229 110,134 112,116 C114,126 112,249 95,320Z" fill="#2a6e2a" />
                <path d="M94,320 C87,248 83,159 82,80 C86,92 99,156 98,320Z" fill="#276227" />
                <path d="M123,320 C115,230 124,122 115,112 C119,128 131,258 124,320Z" fill="#2a6e2a" />
                <path d="M138,320 C130,235 134,168 139,90 C141,116 145,143 140,320Z" fill="#2a6e2a" />
                <path d="M174,320 L174,289 Q177,160 181,123 Q191,194 190,289 L190,320Z" fill="#276227" />
                <path d="M201,320 C194,242 191,143 190,78 C194,110 204,170 205,320Z" fill="#2d7a2d" />
                <path d="M236,320 C237,266 243,182 255,126 C258,149 251,189 240,320Z" fill="#276227" />
                <path d="M255,320 C249,222 251,163 257,73 C260,101 265,150 258,320Z" fill="#2d7a2d" />
                <path d="M256,320 C249,244 254,176 257,118 C260,136 264,186 258,320Z" fill="#2a6e2a" />
                <path d="M257,320 L257,291 C246,204 251,100 253,79 C257,108 265,201 263,291 L263,320Z" fill="#2a6e2a" />
                <path d="M260,320 C253,245 250,194 246,116 C250,126 262,190 262,320Z" fill="#2a6e2a" />
                <path d="M260,320 C245,183 259,86 250,78 C253,95 268,215 262,320Z" fill="#276227" />
                <path d="M296,320 L296,293 C289,245 288,150 290,125 C297,155 302,257 302,293 L302,320Z" fill="#276227" />
                <path d="M303,320 C300,257 312,168 324,80 C326,105 315,137 306,320Z" fill="#2d7a2d" />
                <path d="M304,320 C298,256 304,171 313,113 C317,143 312,184 308,320Z" fill="#276227" />
                <path d="M307,320 C299,192 313,96 307,78 C309,102 319,222 308,320Z" fill="#276227" />
                <path d="M310,320 C304,245 312,201 319,117 C322,143 322,178 314,320Z" fill="#2a6e2a" />
                <path d="M318,320 L318,283 Q317,130 317,96 Q332,165 332,283 L332,320Z" fill="#2d7a2d" />
                <path d="M348,320 L348,292 Q350,159 348,128 Q362,171 363,292 L363,320Z" fill="#276227" />
                <path d="M381,320 C386,214 417,124 418,114 C422,134 410,229 382,320Z" fill="#2d7a2d" />
                <path d="M404,320 L404,284 Q395,125 394,76 Q415,162 416,284 L416,320Z" fill="#2a6e2a" />
                <path d="M433,320 C431,264 435,186 441,97 C443,112 443,152 436,320Z" fill="#2a6e2a" />
                <path d="M461,320 C457,269 453,194 456,126 C458,140 469,186 464,320Z" fill="#2d7a2d" />
                <path d="M498,320 L498,294 Q495,156 494,113 Q513,171 515,294 L515,320Z" fill="#2d7a2d" />
                <path d="M526,320 C523,252 529,142 543,80 C546,101 537,140 529,320Z" fill="#2a6e2a" />
                <path d="M555,320 C549,239 548,183 545,96 C548,122 556,166 557,320Z" fill="#276227" />
                <path d="M574,320 C564,227 563,150 562,72 C564,86 579,141 576,320Z" fill="#2d7a2d" />
                <path d="M596,320 L596,289 Q593,171 602,126 Q609,174 611,289 L611,320Z" fill="#276227" />
                <path d="M599,320 C590,257 593,183 593,105 C595,137 602,157 602,320Z" fill="#2d7a2d" />
                <path d="M601,320 C587,231 603,146 601,128 C605,151 612,230 602,320Z" fill="#276227" />
                <path d="M607,320 C601,205 621,89 626,79 C630,97 627,240 609,320Z" fill="#2d7a2d" />
                <path d="M636,320 C629,243 629,184 631,122 C632,134 642,191 638,320Z" fill="#276227" />
                <path d="M648,320 L648,299 C642,223 650,104 651,81 C655,112 660,214 654,299 L654,320Z" fill="#2a6e2a" />
                <path d="M649,320 C648,258 654,207 666,115 C668,135 660,156 652,320Z" fill="#276227" />
                <path d="M656,320 C655,249 663,171 676,93 C678,113 671,158 659,320Z" fill="#276227" />
                <path d="M670,320 L670,292 C661,227 669,127 673,112 C679,129 682,252 676,292 L676,320Z" fill="#2d7a2d" />
                <path d="M686,320 L686,275 Q683,156 682,99 Q698,141 704,275 L704,320Z" fill="#276227" />
                <path d="M686,320 C678,218 691,106 695,87 C697,99 699,248 688,320Z" fill="#2a6e2a" />
                <path d="M691,320 C679,210 698,82 691,73 C694,82 702,220 692,320Z" fill="#2a6e2a" />
                <path d="M696,320 C691,244 683,180 682,119 C684,146 698,186 699,320Z" fill="#2a6e2a" />
                <path d="M719,320 C715,248 724,192 737,90 C741,124 732,175 722,320Z" fill="#276227" />
                <path d="M748,320 L748,294 C743,199 750,91 752,73 C757,103 761,227 756,294 L756,320Z" fill="#2a6e2a" />
                <path d="M771,320 C767,257 768,212 773,130 C776,147 777,194 774,320Z" fill="#2a6e2a" />
                <path d="M802,320 L802,278 Q796,147 801,115 Q812,178 815,278 L815,320Z" fill="#2a6e2a" />
                <path d="M841,320 L841,288 Q843,153 847,103 Q853,156 855,288 L855,320Z" fill="#2d7a2d" />
                <path d="M861,320 C861,254 865,190 875,126 C879,139 870,174 863,320Z" fill="#2a6e2a" />
                <path d="M888,320 L888,289 C887,234 895,126 905,104 C914,131 907,234 896,289 L896,320Z" fill="#276227" />
                <path d="M929,320 C923,248 922,151 920,75 C924,102 935,160 931,320Z" fill="#276227" />
                <path d="M957,320 L957,300 C951,233 969,120 977,97 C984,130 976,230 964,300 L964,320Z" fill="#2d7a2d" />
                <path d="M987,320 C984,247 983,197 989,121 C992,144 992,170 990,320Z" fill="#276227" />
                <path d="M1000,320 C986,180 982,95 979,77 C982,90 996,232 1002,320Z" fill="#2d7a2d" />
                <path d="M1038,320 C1035,261 1042,184 1058,123 C1062,148 1053,194 1041,320Z" fill="#276227" />
                <path d="M1070,320 C1062,246 1059,155 1057,88 C1061,106 1071,178 1073,320Z" fill="#2d7a2d" />
                <path d="M1086,320 L1086,299 C1074,237 1075,154 1071,129 C1078,157 1092,240 1094,299 L1094,320Z" fill="#2d7a2d" />
                <path d="M1130,320 C1123,187 1137,103 1130,88 C1134,103 1141,226 1132,320Z" fill="#276227" />
                <path d="M1160,320 C1149,222 1159,138 1160,129 C1163,152 1167,225 1162,320Z" fill="#276227" />
                <path d="M1180,320 C1173,257 1177,164 1181,72 C1183,88 1185,168 1182,320Z" fill="#2a6e2a" />
                <path d="M1210,320 L1210,282 C1202,222 1209,112 1208,90 C1213,122 1220,219 1219,282 L1219,320Z" fill="#2d7a2d" />
                <path d="M1236,320 C1228,242 1234,192 1237,119 C1240,149 1243,165 1238,320Z" fill="#2d7a2d" />
                <path d="M1263,320 L1263,288 C1261,237 1277,133 1287,107 C1296,140 1285,241 1272,288 L1272,320Z" fill="#276227" />
                <path d="M1296,320 L1296,271 Q1288,135 1292,71 Q1310,159 1313,271 L1313,320Z" fill="#2a6e2a" />
                <path d="M1330,320 L1330,290 C1325,230 1331,124 1334,108 C1342,124 1344,220 1339,290 L1339,320Z" fill="#2d7a2d" />
                <path d="M1352,320 L1352,293 Q1351,151 1361,123 Q1371,195 1370,293 L1370,320Z" fill="#276227" />
                <path d="M1389,320 L1389,279 Q1384,109 1385,76 Q1402,161 1405,279 L1405,320Z" fill="#2d7a2d" />
                <path d="M1404,320 C1403,255 1405,177 1413,110 C1417,136 1414,158 1408,320Z" fill="#2d7a2d" />
                <rect x="0" y="230" width="1440" height="90" fill="#276227" />

                {/* Wildflowers */}
                <g className="wildflower wf-1" transform="translate(80, 215)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="1.8" ry="3.2" fill="#fff" transform={`rotate(${a})`} opacity="0.9" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#F5E642" />
                </g>
                <g className="wildflower wf-2" transform="translate(225, 208)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="2" ry="3.5" fill="#C4A8E0" transform={`rotate(${a})`} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#fff" />
                </g>
                <g className="wildflower wf-3" transform="translate(370, 220)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-3.5" rx="1.6" ry="3" fill="#E8A0B4" transform={`rotate(${a})`} opacity="0.9" />
                    ))}
                    <circle cx="0" cy="0" r="1.3" fill="#F5E642" />
                </g>
                <g className="wildflower wf-4" transform="translate(510, 198)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="1.8" ry="3.2" fill="#F5E642" transform={`rotate(${a})`} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#8B6914" />
                </g>
                <g className="wildflower wf-5" transform="translate(660, 222)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-3.5" rx="1.6" ry="3" fill="#fff" transform={`rotate(${a})`} opacity="0.9" />
                    ))}
                    <circle cx="0" cy="0" r="1.3" fill="#E8A0B4" />
                </g>
                <g className="wildflower wf-6" transform="translate(800, 210)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="2" ry="3.5" fill="#C4A8E0" transform={`rotate(${a})`} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#fff" />
                </g>
                <g className="wildflower wf-7" transform="translate(950, 218)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-3.5" rx="1.6" ry="3" fill="#E8A0B4" transform={`rotate(${a})`} opacity="0.9" />
                    ))}
                    <circle cx="0" cy="0" r="1.3" fill="#F5E642" />
                </g>
                <g className="wildflower wf-8" transform="translate(1100, 205)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="1.8" ry="3.2" fill="#F5E642" transform={`rotate(${a})`} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#8B6914" />
                </g>
                <g className="wildflower wf-9" transform="translate(1250, 224)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-3.5" rx="1.6" ry="3" fill="#fff" transform={`rotate(${a})`} opacity="0.9" />
                    ))}
                    <circle cx="0" cy="0" r="1.3" fill="#C4A8E0" />
                </g>
                <g className="wildflower wf-10" transform="translate(1380, 212)">
                    {[0,72,144,216,288].map(a => (
                        <ellipse key={a} cx="0" cy="-4" rx="2" ry="3.5" fill="#E8A0B4" transform={`rotate(${a})`} opacity="0.85" />
                    ))}
                    <circle cx="0" cy="0" r="1.5" fill="#F5E642" />
                </g>

                {/* Sunflowers with stems — outer <g> for position, inner <g> for animation */}
                <g transform="translate(180, 170)">
                    <path d="M 0,5 C 3,25 -2,45 1,60" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,20 C -8,14 -14,17 -7,24" fill="#3a7a2a" />
                    <path d="M 1,42 C 9,36 14,39 7,46" fill="#3a7a2a" />
                    <g className="sunflower sf-1">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-16" rx="5.5" ry="10" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-11" rx="4" ry="7" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="8" fill="#5C4319" />
                        <circle cx="0" cy="0" r="6" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(480, 180)">
                    <path d="M 0,4 C -2,20 3,35 0,50" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,17 C -7,12 -12,15 -6,21" fill="#3a7a2a" />
                    <path d="M 0,35 C 8,30 12,33 6,39" fill="#3a7a2a" />
                    <g className="sunflower sf-2">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-14" rx="5" ry="9" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-10" rx="3.5" ry="6" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="7" fill="#5C4319" />
                        <circle cx="0" cy="0" r="5" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(780, 165)">
                    <path d="M 0,6 C 4,28 -3,48 1,65" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,22 C -9,15 -15,19 -8,26" fill="#3a7a2a" />
                    <path d="M 1,45 C 10,38 15,42 8,49" fill="#3a7a2a" />
                    <g className="sunflower sf-3">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-18" rx="6" ry="11" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-12" rx="4.5" ry="7.5" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="9" fill="#5C4319" />
                        <circle cx="0" cy="0" r="7" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(1050, 175)">
                    <path d="M 0,5 C -3,22 2,40 0,55" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,18 C -8,13 -13,16 -6,22" fill="#3a7a2a" />
                    <path d="M 1,38 C 8,32 13,35 7,42" fill="#3a7a2a" />
                    <g className="sunflower sf-4">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-15" rx="5.2" ry="9.5" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-10.5" rx="3.8" ry="6.5" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="7.5" fill="#5C4319" />
                        <circle cx="0" cy="0" r="5.5" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(1320, 172)">
                    <path d="M 0,5 C 2,24 -2,42 1,58" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,20 C -8,14 -13,17 -7,24" fill="#3a7a2a" />
                    <path d="M 1,40 C 9,34 14,37 7,44" fill="#3a7a2a" />
                    <g className="sunflower sf-5">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-16" rx="5.5" ry="10" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-11" rx="4" ry="7" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="8" fill="#5C4319" />
                        <circle cx="0" cy="0" r="6" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(330, 185)">
                    <path d="M 0,4 C -2,18 3,32 0,45" stroke="#2d5a1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 0,15 C -7,10 -11,13 -5,19" fill="#3a7a2a" />
                    <path d="M 0,32 C 7,27 11,30 5,36" fill="#3a7a2a" />
                    <g className="sunflower sf-6">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-13" rx="4.5" ry="8" fill="#EDBE3A" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-9" rx="3.2" ry="5.5" fill="#F5D44B" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="6.5" fill="#5C4319" />
                        <circle cx="0" cy="0" r="4.5" fill="#8B6914" />
                    </g>
                </g>
                <g transform="translate(640, 175)">
                    <path d="M 0,5 C 3,22 -2,40 1,55" stroke="#2d5a1d" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0,19 C -9,13 -14,16 -7,23" fill="#3a7a2a" />
                    <path d="M 1,40 C 9,34 14,37 7,44" fill="#3a7a2a" />
                    <g className="sunflower sf-7">
                        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
                            <ellipse key={`o${a}`} cx="0" cy="-17" rx="5.8" ry="10.5" fill="#F5C842" transform={`rotate(${a})`} opacity="0.9" />
                        ))}
                        {[15,45,75,105,135,165,195,225,255,285,315,345].map(a => (
                            <ellipse key={`i${a}`} cx="0" cy="-11.5" rx="4.2" ry="7.2" fill="#EDBE3A" transform={`rotate(${a})`} />
                        ))}
                        <circle cx="0" cy="0" r="8.5" fill="#5C4319" />
                        <circle cx="0" cy="0" r="6.5" fill="#8B6914" />
                    </g>
                </g>
            </svg>

            {/* Front layer — shortest, brightest */}
            <svg className="grass-layer grass-front" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grassFront" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#348834" />
                        <stop offset="100%" stopColor="#3da03d" />
                    </linearGradient>
                </defs>
                <path d="M-5,320 C-16,279 -18,245 -22,208 C-19,216 0,241 -1,320Z" fill="#348834" />
                <path d="M39,320 C35,276 36,195 41,151 C44,161 44,187 42,320Z" fill="#348834" />
                <path d="M59,320 L59,304 C53,258 61,199 63,181 C71,208 72,263 67,304 L67,320Z" fill="#3da03d" />
                <path d="M91,320 C67,227 65,176 54,157 C57,182 85,244 92,320Z" fill="#3da03d" />
                <path d="M124,320 C124,275 128,227 139,182 C143,193 135,212 127,320Z" fill="#3da03d" />
                <path d="M165,320 C160,283 170,230 182,200 C184,212 179,242 168,320Z" fill="#348834" />
                <path d="M200,320 L200,298 Q200,216 213,185 Q214,229 212,298 L212,320Z" fill="#3faa3f" />
                <path d="M227,320 L227,306 C221,243 224,186 232,165 C237,200 245,262 237,306 L237,320Z" fill="#3faa3f" />
                <path d="M227,320 L227,296 Q226,226 239,201 Q244,243 242,296 L242,320Z" fill="#3da03d" />
                <path d="M229,320 L229,298 C220,250 227,189 233,162 C241,191 244,247 237,298 L237,320Z" fill="#3faa3f" />
                <path d="M235,320 C231,285 233,240 243,191 C245,199 245,219 239,320Z" fill="#3da03d" />
                <path d="M251,320 C247,273 257,217 270,172 C273,187 266,216 255,320Z" fill="#348834" />
                <path d="M292,320 L292,294 Q291,228 297,194 Q306,233 304,294 L304,320Z" fill="#3faa3f" />
                <path d="M325,320 L325,293 C321,256 332,185 340,165 C346,198 344,248 332,293 L332,320Z" fill="#348834" />
                <path d="M351,320 L351,303 C347,258 351,229 356,203 C364,222 367,285 361,303 L361,320Z" fill="#348834" />
                <path d="M374,320 C367,259 393,188 396,176 C397,193 397,258 375,320Z" fill="#3da03d" />
                <path d="M411,320 C401,255 407,206 403,191 C405,207 413,278 412,320Z" fill="#3da03d" />
                <path d="M448,320 C448,248 474,175 480,159 C484,168 477,250 450,320Z" fill="#348834" />
                <path d="M474,320 L474,309 C468,281 476,228 477,210 C485,232 486,275 481,309 L481,320Z" fill="#348834" />
                <path d="M509,320 C503,278 505,211 511,162 C515,184 514,221 512,320Z" fill="#3faa3f" />
                <path d="M540,320 L540,301 Q540,218 545,202 Q551,241 553,301 L553,320Z" fill="#3faa3f" />
                <path d="M578,320 C559,246 565,185 555,172 C557,181 579,263 579,320Z" fill="#348834" />
                <path d="M605,320 L605,301 Q598,228 598,190 Q611,230 618,301 L618,320Z" fill="#348834" />
                <path d="M634,320 L634,292 Q635,203 633,178 Q650,208 647,292 L647,320Z" fill="#3da03d" />
                <path d="M667,320 C662,283 664,249 669,198 C671,211 673,227 670,320Z" fill="#3da03d" />
                <path d="M703,320 C699,267 710,202 723,153 C724,176 714,193 705,320Z" fill="#3da03d" />
                <path d="M714,320 C711,277 718,224 732,178 C735,191 728,229 717,320Z" fill="#3da03d" />
                <path d="M715,320 L715,305 C714,262 725,218 735,195 C741,219 731,261 722,305 L722,320Z" fill="#348834" />
                <path d="M717,320 C709,277 711,197 714,155 C717,173 721,193 720,320Z" fill="#3faa3f" />
                <path d="M718,320 C713,279 709,217 708,173 C710,188 725,206 722,320Z" fill="#348834" />
                <path d="M745,320 L745,299 C738,259 746,198 755,185 C762,215 760,263 752,299 L752,320Z" fill="#348834" />
                <path d="M765,320 L765,296 C759,249 767,172 773,156 C777,175 776,248 771,296 L771,320Z" fill="#348834" />
                <path d="M800,320 L800,302 C791,259 802,196 803,172 C809,203 810,269 807,302 L807,320Z" fill="#3faa3f" />
                <path d="M841,320 L841,306 C839,267 845,221 853,202 C858,230 856,276 847,306 L847,320Z" fill="#348834" />
                <path d="M859,320 L859,290 Q861,211 874,184 Q876,232 874,290 L874,320Z" fill="#3faa3f" />
                <path d="M860,320 L860,303 C855,257 868,196 879,166 C888,185 880,265 868,303 L868,320Z" fill="#3faa3f" />
                <path d="M861,320 C857,277 864,241 879,194 C883,210 873,220 865,320Z" fill="#3da03d" />
                <path d="M863,320 C860,265 859,199 864,157 C867,177 871,211 865,320Z" fill="#348834" />
                <path d="M869,320 L869,303 C861,269 862,215 861,191 C866,207 875,276 876,303 L876,320Z" fill="#3da03d" />
                <path d="M872,320 L872,308 C864,246 864,188 863,174 C871,190 883,266 880,308 L880,320Z" fill="#3da03d" />
                <path d="M872,320 L872,300 C870,273 878,222 889,208 C895,240 888,286 878,300 L878,320Z" fill="#3da03d" />
                <path d="M872,320 C870,280 868,248 874,192 C877,204 882,223 876,320Z" fill="#3faa3f" />
                <path d="M890,320 L890,300 Q890,224 897,205 Q910,241 906,300 L906,320Z" fill="#3faa3f" />
                <path d="M928,320 C920,281 916,220 911,173 C913,183 929,205 932,320Z" fill="#3faa3f" />
                <path d="M952,320 L952,304 C945,248 953,200 955,187 C963,214 961,271 958,304 L958,320Z" fill="#3faa3f" />
                <path d="M984,320 C984,251 1002,208 1005,200 C1008,222 1007,272 986,320Z" fill="#3da03d" />
                <path d="M1032,320 L1032,295 Q1035,196 1050,161 Q1053,200 1045,295 L1045,320Z" fill="#348834" />
                <path d="M1055,320 C1049,279 1052,245 1057,209 C1059,221 1062,237 1058,320Z" fill="#3faa3f" />
                <path d="M1081,320 C1081,277 1085,224 1093,162 C1095,174 1090,223 1084,320Z" fill="#3da03d" />
                <path d="M1127,320 L1127,306 C1120,256 1132,211 1137,189 C1143,209 1144,261 1135,306 L1135,320Z" fill="#3da03d" />
                <path d="M1158,320 L1158,303 C1148,265 1155,223 1161,205 C1166,225 1170,283 1165,303 L1165,320Z" fill="#3da03d" />
                <path d="M1181,320 C1175,278 1180,218 1183,162 C1187,176 1188,215 1185,320Z" fill="#3da03d" />
                <path d="M1207,320 C1196,283 1195,241 1191,206 C1194,220 1209,237 1210,320Z" fill="#348834" />
                <path d="M1247,320 C1243,242 1271,185 1276,169 C1279,181 1270,270 1248,320Z" fill="#348834" />
                <path d="M1266,320 L1266,303 C1263,262 1271,204 1274,186 C1280,209 1280,260 1273,303 L1273,320Z" fill="#3faa3f" />
                <path d="M1268,320 L1268,310 C1260,276 1270,231 1272,206 C1280,241 1283,264 1277,310 L1277,320Z" fill="#3faa3f" />
                <path d="M1270,320 C1261,279 1257,223 1253,166 C1257,185 1272,213 1273,320Z" fill="#3da03d" />
                <path d="M1271,320 L1271,307 C1269,271 1277,216 1282,199 C1291,221 1288,279 1281,307 L1281,320Z" fill="#3da03d" />
                <path d="M1276,320 C1269,272 1273,232 1278,166 C1282,181 1283,207 1280,320Z" fill="#3faa3f" />
                <path d="M1315,320 L1315,308 C1308,275 1309,231 1307,205 C1314,224 1324,279 1324,308 L1324,320Z" fill="#348834" />
                <path d="M1338,320 C1325,246 1323,193 1321,175 C1324,195 1342,272 1340,320Z" fill="#3faa3f" />
                <path d="M1371,320 C1364,275 1368,232 1373,199 C1375,214 1380,238 1374,320Z" fill="#3faa3f" />
                <path d="M1400,320 L1400,303 C1395,245 1400,186 1403,162 C1411,186 1408,251 1406,303 L1406,320Z" fill="#3da03d" />
                <rect x="0" y="255" width="1440" height="65" fill="#348834" />
            </svg>

            {/* Butterfly overlay — z-index 4, above all grass */}
            <svg className="butterfly-layer" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <g transform="translate(200, 120)">
                    <g className="butterfly-1">
                        <line x1="0" y1="-6" x2="0" y2="6" stroke="#4a3520" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="-1" y1="-6" x2="-4" y2="-10" stroke="#4a3520" strokeWidth="0.7" strokeLinecap="round" />
                        <line x1="1" y1="-6" x2="4" y2="-10" stroke="#4a3520" strokeWidth="0.7" strokeLinecap="round" />
                        <ellipse className="wing-l" cx="-8" cy="-2" rx="8" ry="5.5" fill="#E8913A" opacity="0.85" />
                        <ellipse className="wing-r" cx="8" cy="-2" rx="8" ry="5.5" fill="#E8913A" opacity="0.85" />
                        <ellipse className="wing-lb" cx="-6" cy="3" rx="5.5" ry="3.5" fill="#F5A623" opacity="0.7" />
                        <ellipse className="wing-rb" cx="6" cy="3" rx="5.5" ry="3.5" fill="#F5A623" opacity="0.7" />
                    </g>
                </g>
                <g transform="translate(720, 100)">
                    <g className="butterfly-2">
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#3a3050" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="-1" y1="-5" x2="-3" y2="-9" stroke="#3a3050" strokeWidth="0.7" strokeLinecap="round" />
                        <line x1="1" y1="-5" x2="3" y2="-9" stroke="#3a3050" strokeWidth="0.7" strokeLinecap="round" />
                        <ellipse className="wing-l" cx="-7" cy="-1.5" rx="7" ry="5" fill="#7EB5D6" opacity="0.85" />
                        <ellipse className="wing-r" cx="7" cy="-1.5" rx="7" ry="5" fill="#7EB5D6" opacity="0.85" />
                        <ellipse className="wing-lb" cx="-5" cy="3" rx="5" ry="3" fill="#A8D4E8" opacity="0.7" />
                        <ellipse className="wing-rb" cx="5" cy="3" rx="5" ry="3" fill="#A8D4E8" opacity="0.7" />
                    </g>
                </g>
                <g transform="translate(1100, 140)">
                    <g className="butterfly-3">
                        <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#3a2040" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="-1" y1="-5.5" x2="-3.5" y2="-9.5" stroke="#3a2040" strokeWidth="0.7" strokeLinecap="round" />
                        <line x1="1" y1="-5.5" x2="3.5" y2="-9.5" stroke="#3a2040" strokeWidth="0.7" strokeLinecap="round" />
                        <ellipse className="wing-l" cx="-7.5" cy="-2" rx="7.5" ry="5.2" fill="#B088D4" opacity="0.85" />
                        <ellipse className="wing-r" cx="7.5" cy="-2" rx="7.5" ry="5.2" fill="#B088D4" opacity="0.85" />
                        <ellipse className="wing-lb" cx="-5.5" cy="3" rx="5.2" ry="3.2" fill="#C4A8E0" opacity="0.7" />
                        <ellipse className="wing-rb" cx="5.5" cy="3" rx="5.2" ry="3.2" fill="#C4A8E0" opacity="0.7" />
                    </g>
                </g>
            </svg>

            {/* Firefly overlay — visible on hover only */}
            <svg className="firefly-layer" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <circle className="firefly ff-1" cx="150" cy="130" r="2" fill="#FFF8B0" />
                <circle className="firefly ff-2" cx="400" cy="110" r="2.5" fill="#FFF8B0" />
                <circle className="firefly ff-3" cx="650" cy="155" r="2" fill="#FFF8B0" />
                <circle className="firefly ff-4" cx="900" cy="120" r="2.5" fill="#FFF8B0" />
                <circle className="firefly ff-5" cx="1150" cy="145" r="2" fill="#FFF8B0" />
                <circle className="firefly ff-6" cx="1350" cy="105" r="2.5" fill="#FFF8B0" />
            </svg>
        </div>
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
    const outerFill = 'white';
    const outerShadow = '0 0 0 0 0.364706 0 0 0 0 0.658824 0 0 0 0 0.478431 0 0 0 0.66 0';
    const innerShadow = '0 0 0 0 0.364706 0 0 0 0 0.658824 0 0 0 0 0.478431 0 0 0 0.74 0';
    return (
        <svg className="jharokha-frame" viewBox="0 0 378 378" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {/* Radial gradient: all-white (matches SVG exactly) */}
                <radialGradient id="jf_inner_grad" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="55%" stopColor="white" />
                    <stop offset="100%" stopColor="white" />
                </radialGradient>

                {/* Text gradient: dark green → vibrant green */}
                <linearGradient id="jf_text_grad" x1="100" y1="170" x2="280" y2="200" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#173116" />
                    <stop offset="1" stopColor="#4E9C4B" />
                </linearGradient>

                <filter id="jf_outer" x="0" y="0" width="377.493" height="377.403" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="22.3898" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values={outerShadow} />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                </filter>
                <filter id="jf_inner" x="39.9438" y="39.9435" width="297.868" height="297.797" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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
                    <feColorMatrix type="matrix" values={innerShadow} />
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
                </filter>
            </defs>

            {/* Outer shape — with soft inner shadow */}
            <g filter="url(#jf_outer)">
                <path d="M123.86 26.2409C164.789 27.1365 175.268 17.5536 188.612 0C201.24 18.1805 217.719 27.0469 241.989 26.2409C287.712 24.7224 299.397 52.7504 301.277 77.2001C345.878 77.2001 352.058 110.337 352.058 126.726C349.908 159.953 359.76 175.536 377.492 187.448C349.371 206.345 352.345 232.765 351.968 247.721C350.804 293.934 316.771 298.053 301.098 299.934C301.098 336.295 275.664 349.64 244.945 349.64C205.718 347.221 194.254 368.208 188.164 377.403C181.178 361.103 160.311 348.148 138.548 349.46C93.4104 352.181 77.2897 327.518 76.3045 299.218C37.1134 298.644 25.5244 271.812 25.5244 248.438C25.5244 208.315 16.5685 201.508 0 187.448C27.9425 166.491 23.2854 152.967 25.5244 121.622C27.5498 93.2658 48.8994 75.4089 77.4688 77.7375C76.4836 45.4961 95.1118 27.4051 123.86 26.2409Z" fill={outerFill} />
            </g>

            {/* Inner shape — radial gradient */}
            <g filter="url(#jf_inner)">
                <path d="M137.678 60.6494C169.974 61.3561 178.242 53.7946 188.772 39.9435C198.736 54.2892 211.739 61.2854 230.89 60.6494C266.969 59.4512 276.189 81.5673 277.673 100.86C312.866 100.86 317.742 127.007 317.742 139.939C316.046 166.157 323.819 178.454 337.812 187.853C315.622 202.764 317.968 223.611 317.671 235.413C316.752 271.878 289.898 275.128 277.531 276.612C277.531 305.304 257.461 315.833 233.222 315.833C202.269 313.925 193.224 330.485 188.418 337.741C182.906 324.879 166.44 314.657 149.268 315.692C113.651 317.839 100.931 298.378 100.153 276.047C69.2289 275.595 60.0844 254.422 60.0844 235.978C60.0844 204.318 53.0175 198.948 39.9438 187.853C61.9924 171.316 58.3177 160.645 60.0844 135.911C61.6826 113.537 78.5289 99.4464 101.072 101.284C100.295 75.8431 114.994 61.5681 137.678 60.6494Z" fill="url(#jf_inner_grad)" />
            </g>

            {/* Animated text labels in center */}
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

    /* Blog posts from admin (API) */
    const [adminBlogs, setAdminBlogs] = useState([]);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await api.getBlogs();
                const published = data.filter(b => b.status === 'Published');
                setAdminBlogs(published);
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

            {/* ═══ Full-Screen Hero Rectangle ═══ */}
            <section className="hero-rect">
                {/* Glass strips */}
                <div className="glass-strip"></div>
                <div className="glass-strip-2"></div>

                <div className="hero-rect-inner">
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
                        'gradient-blue': 'linear-gradient(135deg, #2D5A2C 0%, #17402A 50%, #244A23 100%)',
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
                {/* Blog strip — only shown when published blogs exist */}
                {adminBlogs.length > 0 && (
                <div className="blog-strip animate-on-scroll">
                    {adminBlogs.map((item, i) => (
                        <a href={`/blog/${item.slug}`} className="blog-chip" key={i}>
                            <span className="blog-chip-thumb" style={{ background: item.featureImage ? `url(${item.featureImage}) center/cover no-repeat` : '#17402A' }} />
                            <div className="blog-chip-text">
                                <span className="blog-chip-title">{item.title}</span>
                                <span className="blog-chip-source">{item.category || 'From our blog'}</span>
                            </div>
                        </a>
                    ))}
                </div>
                )}

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
            {adminBlogs.length > 0 && (
            <section className="updates-section animate-on-scroll">
                <div className="section-header">
                    <p className="section-label">अपडेट · UPDATES</p>
                    <h2 className="section-title">Research & Insights</h2>
                </div>
                <div className="updates-grid">
                    {adminBlogs.map((b) => (
                        <a href={`/blog/${b.slug}`} className="update-card" key={b.id} style={{ textDecoration: 'none' }}>
                            <div
                                className="update-card-image"
                                style={{
                                    background: b.featureImage
                                        ? `url(${b.featureImage}) center/cover no-repeat`
                                        : 'linear-gradient(135deg, #17402A 0%, #2D5A2C 100%)'
                                }}
                            />
                            <div className="update-card-body">
                                <span className="update-category">{b.category || 'BLOG'}</span>
                                <h3 className="update-title">{b.title}</h3>
                                <span className="update-date">{b.publishDate || b.createdAt || ''}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
            )}

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
                    <a href="/contact" className="btn-primary btn-large cta-connect-btn">Let’s Connect ✦</a>
                </div>
                <div className="cta-grass-wrapper">
                    <GrassScene />
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <Footer />
        </div>
    );
}

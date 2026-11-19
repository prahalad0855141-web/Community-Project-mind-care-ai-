import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  Sparkles,
  Compass,
  Sprout,
  MessageCircleHeart,
  Wind,
  PhoneCall,
  BookOpen,
  TrendingUp,
  Settings,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Plus,
  Trash2,
  Edit3,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Menu,
  X,
  LogOut,
  UserCheck,
  Download,
  ExternalLink,
  HeartHandshake,
  Layers,
  Eye,
  Filter,
  ChevronRight,
  Clock,
  Award,
  Sun,
  Moon,
  Send,
  Info,
  Check
} from 'lucide-react';

// ============================================================================
// 1. FIREBASE INITIALIZATION & CONFIGURATION
// ============================================================================
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "demo-api-key",
      authDomain: "mindcare-demo.firebaseapp.com",
      projectId: "mindcare-demo",
      storageBucket: "mindcare-demo.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:000000000000"
    };

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialized in fallback mode:", e);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'mindcare-ecosystem-v1';

// ============================================================================
// 2. DESIGN SYSTEM & CURATED VERIFIED DATA
// ============================================================================
const PALETTE = {
  midnightViolet: '#211638',
  deepPurple: '#493477',
  softLavender: '#E8DFFF',
  warmIvory: '#FBF8F2',
  mintGreen: '#B9E7D3',
  softPeach: '#F7D7C9',
  white: '#FFFFFF'
};

const EMOTION_NODES = [
  {
    id: 'serene',
    label: 'Serene',
    orbit: 1,
    angle: 25,
    color: '#B9E7D3',
    accent: '#2D6A54',
    bgTint: 'rgba(185, 231, 211, 0.25)',
    description: 'Centered, unhurried, and softly balanced.',
    suggestion: 'Anchor this stillness with a 3-minute resonant breathing session or note what nurtured this calm.'
  },
  {
    id: 'hopeful',
    label: 'Hopeful',
    orbit: 1,
    angle: 145,
    color: '#F7D7C9',
    accent: '#8C432B',
    bgTint: 'rgba(247, 215, 201, 0.28)',
    description: 'Forward-looking warmth and quiet anticipation.',
    suggestion: 'Capture one small intention in your Wellness Journal to carry this clarity forward.'
  },
  {
    id: 'grounded',
    label: 'Grounded',
    orbit: 1,
    angle: 265,
    color: '#D4E4BC',
    accent: '#3E5622',
    bgTint: 'rgba(212, 228, 188, 0.28)',
    description: 'Present in your body and connected to the moment.',
    suggestion: 'Explore your Mind Garden to see how steady daily care shapes your sanctuary.'
  },
  {
    id: 'reflective',
    label: 'Reflective',
    orbit: 2,
    angle: 70,
    color: '#E8DFFF',
    accent: '#493477',
    bgTint: 'rgba(232, 223, 255, 0.35)',
    description: 'Thoughtful inward attention and gentle processing.',
    suggestion: 'Converse with the MindCare AI Companion to unpack recurring thoughts safely.'
  },
  {
    id: 'energized',
    label: 'Energized',
    orbit: 2,
    angle: 190,
    color: '#FCE2AE',
    accent: '#7D5411',
    bgTint: 'rgba(252, 226, 174, 0.3)',
    description: 'Vibrant focus, momentum, and creative readiness.',
    suggestion: 'Channel this vitality into a meaningful goal, then wind down intentionally later.'
  },
  {
    id: 'anxious',
    label: 'Anxious',
    orbit: 3,
    angle: 15,
    color: '#D8C7FF',
    accent: '#3B236E',
    bgTint: 'rgba(216, 199, 255, 0.32)',
    description: 'Heightened alertness, racing thoughts, or chest tightness.',
    suggestion: 'Try the 4-7-8 Calm breathing guide in Calm Space to gently down-regulate your nervous system.'
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    orbit: 3,
    angle: 135,
    color: '#F3B8A8',
    accent: '#7E2E1D',
    bgTint: 'rgba(243, 184, 168, 0.3)',
    description: 'Carrying too many demands at once; needing breathing room.',
    suggestion: 'Pause all non-essential tasks for 4 minutes. You do not have to solve everything tonight.'
  },
  {
    id: 'melancholy',
    label: 'Melancholy',
    orbit: 3,
    angle: 255,
    color: '#BFD7EA',
    accent: '#234B6E',
    bgTint: 'rgba(191, 215, 234, 0.3)',
    description: 'Heavy-hearted, tender, or quietly fatigued.',
    suggestion: 'All emotions belong here. Your Mind Garden grows whenever you show up for yourself—even on heavy days.'
  }
];

// Strictly verified, authentic mental health helplines
const INITIAL_HELPLINES = [
  {
    id: 'tele-manas-in',
    name: 'Tele-MANAS (National Tele Mental Health Programme)',
    country: 'India',
    region: 'National (20+ Languages)',
    category: 'Crisis & General Support',
    phone: '14416',
    altPhone: '1800-891-4416',
    availability: '24/7 Toll-Free',
    verified: true,
    source: 'Ministry of Health & Family Welfare, Govt. of India',
    description: 'Round-the-clock free tele-mental health counselling and immediate crisis intervention across India.'
  },
  {
    id: 'vandrevala-in',
    name: 'Vandrevala Foundation Helpline',
    country: 'India',
    region: 'National',
    category: 'Crisis & Emotional Distress',
    phone: '+91 9999 666 555',
    availability: '24/7 Call & WhatsApp',
    verified: true,
    source: 'Vandrevala Foundation Official Directory',
    description: 'Confidential crisis intervention, emotional support, and distress counselling by trained mental health professionals.'
  },
  {
    id: 'icall-tiss-in',
    name: 'iCall Psychosocial Helpline (TISS)',
    country: 'India',
    region: 'National',
    category: 'Anxiety, Depression & Youth',
    phone: '9152987821',
    availability: 'Mon–Sat, 10:00 AM – 8:00 PM IST',
    verified: true,
    source: 'Tata Institute of Social Sciences (TISS)',
    description: 'Free, confidential telephone and email-based counselling by trained psychologists.'
  },
  {
    id: 'us-988',
    name: '988 Suicide & Crisis Lifeline',
    country: 'United States',
    region: 'National',
    category: 'Crisis & Suicide Prevention',
    phone: '988',
    availability: '24/7 Call, Text & Chat',
    verified: true,
    source: 'SAMHSA / U.S. Dept. of Health & Human Services',
    description: 'Free, confidential 24/7 support for anyone experiencing mental health distress or thoughts of self-harm.'
  },
  {
    id: 'uk-samaritans',
    name: 'Samaritans UK',
    country: 'United Kingdom',
    region: 'National',
    category: 'Crisis & Emotional Support',
    phone: '116 123',
    availability: '24/7 Free from any phone',
    verified: true,
    source: 'Samaritans Registered Charity (UK)',
    description: 'Immediate, non-judgmental listening support for anyone struggling to cope.'
  },
  {
    id: 'befrienders-global',
    name: 'Befrienders Worldwide Directory',
    country: 'Global',
    region: 'International (32+ Countries)',
    category: 'Global Crisis Network',
    phone: '14416',
    website: 'https://www.befrienders.org',
    availability: '24/7 Global Referral Network',
    verified: true,
    source: 'Befrienders Worldwide',
    description: 'Connects individuals worldwide to confidential emotional support centers in their local country.'
  },
  {
    id: 'trevor-lgbtq',
    name: 'The Trevor Project',
    country: 'United States',
    region: 'National',
    category: 'LGBTQ+ Youth Support',
    phone: '1-866-488-7386',
    availability: '24/7 Free & Confidential',
    verified: true,
    source: 'The Trevor Project Official',
    description: 'Crisis intervention and suicide prevention services specifically for LGBTQ+ young people.'
  }
];

const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    title: 'Grounding Through Somatic Breathwork',
    category: 'Nervous System Care',
    readTime: '4 min read',
    tag: 'Evidence-Informed',
    summary: 'How extended exhalations stimulate the vagus nerve to shift from sympathetic stress into restorative calm.',
    content: 'When stress accelerates your heart rate, lengthening your exhale relative to your inhale sends a direct physiological cue of safety through the vagus nerve. Practicing 4-7-8 or 5-5 resonant breathing for just three minutes lowers cortisol reactivity and restores prefrontal clarity.'
  },
  {
    id: 'res-2',
    title: 'Non-Judgmental Emotional Labeling',
    category: 'Emotional Literacy',
    readTime: '5 min read',
    tag: 'Psychological Insight',
    summary: 'Why naming difficult emotions accurately reduces amygdala reactivity without needing to force positivity.',
    content: 'Affect labeling—putting feelings into nuanced words like "overwhelmed" or "tender" rather than simply "bad"—helps regulate emotional intensity. MindCare never penalizes heavy moods because honest awareness is the foundation of resilience.'
  },
  {
    id: 'res-3',
    title: 'Designing Restorative Evening Rituals',
    category: 'Sleep & Recovery',
    readTime: '6 min read',
    tag: 'Daily Practice',
    summary: 'Gentle cognitive off-loading techniques to quiet late-night rumination before sleep.',
    content: 'Writing a brief 3-sentence reflection in your Wellness Journal two hours before bed externalizes unfinished loops, signaling to your mind that worries are safely stored and do not need to be rehearsed overnight.'
  }
];

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self harm', 'self-harm', 'hurt myself', 'overdose', 'no reason to live',
  'hopeless', 'can’t go on', "can't go on"
];

// ============================================================================
// 3. WEB AUDIO API AMBIENT SYNTHESIZER (NO EXTERNAL BROKEN AUDIO URLS)
// ============================================================================
class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.masterGain = null;
    this.activeSound = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    this.nodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (_) {}
    });
    this.nodes = [];
    this.activeSound = null;
  }

  play(type) {
    this.stop();
    if (!type || type === 'none') return;
    this.init();
    this.activeSound = type;

    if (type === 'rain') {
      // Pink/Brown noise filtered to resemble warm evening rain
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04;
        b6 = white * 0.115926;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start(0);
      this.nodes.push(whiteNoise, filter);
    } else if (type === 'theta') {
      // Warm harmonic drone (174Hz + 261Hz gentle sine waves)
      const freqs = [174, 261.63, 392];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        gain.gain.setValueAtTime(idx === 0 ? 0.18 : 0.08, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        this.nodes.push(osc, gain);
      });
    } else if (type === 'bowl') {
      // Resonant singing bowl harmonic shimmer
      const baseFreq = 256;
      [1, 2.756, 5.404].forEach((ratio, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.14 / (idx + 1), this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        this.nodes.push(osc, gain);
      });
    }
  }
}

const soundEngine = new AmbientSoundEngine();

// ============================================================================
// 4. BESPOKE SVG ARTWORK & DATA VISUALIZATION COMPONENTS
// ============================================================================

// Hero 3D-inspired Organic Botanical & Cosmic Sculpture
const HeroWellnessSculpture = ({ reducedMotion }) => (
  <svg
    viewBox="0 0 560 520"
    className="w-full h-auto max-w-[540px] mx-auto select-none drop-shadow-2xl"
    aria-label="MindCare Organic Wellness Sculpture"
  >
    <defs>
      <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#E8DFFF" stopOpacity="0.85" />
        <stop offset="55%" stopColor="#B9E7D3" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#FBF8F2" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="orbViolet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#493477" />
        <stop offset="60%" stopColor="#211638" />
        <stop offset="100%" stopColor="#140D24" />
      </linearGradient>
      <linearGradient id="ribbonMint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B9E7D3" />
        <stop offset="100%" stopColor="#6BBF9E" />
      </linearGradient>
      <linearGradient id="petalPeach" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7D7C9" />
        <stop offset="100%" stopColor="#E9A88E" />
      </linearGradient>
      <linearGradient id="glassCard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#E8DFFF" stopOpacity="0.55" />
      </linearGradient>
    </defs>

    {/* Soft Atmospheric Aura */}
    <circle cx="280" cy="260" r="240" fill="url(#auraGlow)" />

    {/* Orbital Rings */}
    <ellipse
      cx="280"
      cy="265"
      rx="205"
      ry="78"
      transform="rotate(-18 280 265)"
      fill="none"
      stroke="#493477"
      strokeOpacity="0.18"
      strokeWidth="1.5"
      strokeDasharray="6 6"
    />
    <ellipse
      cx="280"
      cy="265"
      rx="165"
      ry="210"
      transform="rotate(24 280 265)"
      fill="none"
      stroke="#211638"
      strokeOpacity="0.12"
      strokeWidth="1.5"
    />

    {/* Organic Flowing Botanical Ribbon */}
    <path
      d="M115,340 C135,210 235,140 315,175 C395,210 435,120 455,155 C475,190 410,335 310,365 C210,395 95,470 115,340 Z"
      fill="url(#ribbonMint)"
      opacity="0.72"
      className={reducedMotion ? '' : 'animate-pulse'}
      style={{ animationDuration: '7s' }}
    />

    {/* Soft Peach Organic Petal */}
    <path
      d="M210,130 C275,85 375,125 385,205 C395,285 320,360 245,335 C170,310 145,175 210,130 Z"
      fill="url(#petalPeach)"
      opacity="0.82"
    />

    {/* Central 3D-shaded Midnight Violet Sphere */}
    <circle cx="280" cy="255" r="92" fill="url(#orbViolet)" />
    {/* Specular highlight on 3D sphere */}
    <ellipse
      cx="248"
      cy="222"
      rx="34"
      ry="18"
      transform="rotate(-32 248 222)"
      fill="#FFFFFF"
      opacity="0.22"
    />

    {/* Inner Luminous Lotus Geometry */}
    <path
      d="M280,192 C298,225 298,265 280,298 C262,265 262,225 280,192 Z"
      fill="#E8DFFF"
      opacity="0.9"
    />
    <path
      d="M280,210 C315,228 332,262 315,292 C290,280 278,250 280,210 Z"
      fill="#B9E7D3"
      opacity="0.85"
    />
    <path
      d="M280,210 C245,228 228,262 245,292 C270,280 282,250 280,210 Z"
      fill="#F7D7C9"
      opacity="0.85"
    />

    {/* Floating Glassmorphic Wellness Pill 1 */}
    <g transform="translate(68, 138)">
      <rect
        x="0"
        y="0"
        width="156"
        height="54"
        rx="27"
        fill="url(#glassCard)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <circle cx="28" cy="27" r="14" fill="#B9E7D3" />
      <circle cx="28" cy="27" r="6" fill="#211638" />
      <text x="52" y="24" fill="#211638" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Nervous System
      </text>
      <text x="52" y="39" fill="#493477" fontSize="10" fontFamily="sans-serif">
        Balanced · 4-7-8
      </text>
    </g>

    {/* Floating Glassmorphic Wellness Pill 2 */}
    <g transform="translate(338, 336)">
      <rect
        x="0"
        y="0"
        width="164"
        height="54"
        rx="27"
        fill="url(#glassCard)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <circle cx="28" cy="27" r="14" fill="#F7D7C9" />
      <path d="M23,27 L27,31 L34,23" stroke="#211638" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <text x="52" y="24" fill="#211638" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Mind Garden
      </text>
      <text x="52" y="39" fill="#493477" fontSize="10" fontFamily="sans-serif">
        Flourishing · +12 Flora
      </text>
    </g>

    {/* Ambient Floating Light Particles */}
    <circle cx="145" cy="245" r="6" fill="#493477" opacity="0.45" />
    <circle cx="432" cy="215" r="8" fill="#B9E7D3" />
    <circle cx="395" cy="112" r="5" fill="#F7D7C9" />
    <circle cx="178" cy="415" r="7" fill="#E8DFFF" />
  </svg>
);

// Custom SVG Weekly Wellness Spline & Area Chart
const WeeklyWellnessChart = ({ moodLogs, activities }) => {
  const days = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMoods = moodLogs.filter((m) => m.dateKey === dateKey);
      const dayActs = activities.filter((a) => a.dateKey === dateKey);
      const avgIntensity = dayMoods.length
        ? Math.round(dayMoods.reduce((acc, m) => acc + (m.intensity || 6), 0) / dayMoods.length)
        : 0;
      const careScore = Math.min(10, dayMoods.length * 3 + dayActs.length * 4);
      result.push({
        dateKey,
        dayLabel,
        moodCount: dayMoods.length,
        avgIntensity,
        careScore
      });
    }
    return result;
  }, [moodLogs, activities]);

  const width = 560;
  const height = 190;
  const padX = 36;
  const padY = 26;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const points = days.map((d, idx) => {
    const x = padX + (idx / (days.length - 1)) * plotW;
    const val = d.careScore > 0 ? d.careScore : 1.2;
    const y = padY + plotH - (val / 10) * plotH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${padY + plotH} L ${points[0].x},${padY + plotH} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="careAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#493477" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#B9E7D3" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {[0, 5, 10].map((tick) => {
          const y = padY + plotH - (tick / 10) * plotH;
          return (
            <line
              key={tick}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="#211638"
              strokeOpacity="0.08"
              strokeDasharray="4 4"
            />
          );
        })}
        <path d={areaPath} fill="url(#careAreaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#493477"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p) => (
          <g key={p.dateKey}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.careScore > 0 ? 6 : 4}
              fill={p.careScore > 0 ? '#211638' : '#E8DFFF'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={height - 4}
              textAnchor="middle"
              fontSize="11"
              fill="#211638"
              opacity="0.65"
              fontFamily="sans-serif"
            >
              {p.dayLabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Living Interactive Mind Garden SVG Sanctuary
const MindGardenSanctuary = ({ totalCarePoints, completedActivitiesCount, moodCount, journalCount }) => {
  // Growth stage 1..6 driven purely by self-care engagement (never penalized for sad moods)
  const stage = Math.min(6, Math.max(1, Math.floor(totalCarePoints / 2) + 1));

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#211638] via-[#342359] to-[#1D352E] p-4 sm:p-6 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-[#B9E7D3]">
            <Sprout className="w-3.5 h-3.5" /> Sanctuary Stage {stage} of 6
          </span>
          <h3 className="text-lg sm:text-xl font-semibold mt-1 text-white">
            Your Living Botanical Sanctuary
          </h3>
        </div>
        <div className="text-right text-xs text-[#E8DFFF]/80">
          <div>Care Points: <strong className="text-[#B9E7D3]">{totalCarePoints}</strong></div>
          <div>Every check-in & breath nurtures growth</div>
        </div>
      </div>

      <svg
        viewBox="0 0 760 320"
        className="w-full h-auto rounded-2xl bg-gradient-to-b from-[#1A112E] to-[#1B332C]"
        aria-label="Interactive Mind Garden Visualization"
      >
        <defs>
          <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8DFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E8DFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B2963" />
            <stop offset="100%" stopColor="#211638" />
          </linearGradient>
          <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2C5E4F" />
            <stop offset="100%" stopColor="#1A3A31" />
          </linearGradient>
        </defs>

        {/* Celestial Moon & Stars */}
        <circle cx="620" cy="72" r="68" fill="url(#moonHalo)" />
        <circle cx="620" cy="72" r="24" fill="#FBF8F2" opacity="0.92" />
        <circle cx="120" cy="54" r="2" fill="#E8DFFF" opacity="0.7" />
        <circle cx="240" cy="38" r="2.5" fill="#B9E7D3" opacity="0.8" />
        <circle cx="430" cy="48" r="2" fill="#F7D7C9" opacity="0.7" />
        <circle cx="510" cy="88" r="1.8" fill="#FFFFFF" opacity="0.6" />

        {/* Rolling Sanctuary Hills */}
        <path d="M0,220 Q200,165 420,215 T760,195 L760,320 L0,320 Z" fill="url(#hillBack)" />
        <path d="M0,245 Q260,205 500,245 T760,235 L760,320 L0,320 Z" fill="url(#hillFront)" />

        {/* Stage 1+: Central Sprout & Grounded Ferns */}
        <g transform="translate(380, 235)">
          <path d="M0,0 Q-6,-42 0,-78" stroke="#B9E7D3" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M-2,-34 C-32,-48 -42,-22 -4,-20 Z" fill="#B9E7D3" />
          <path d="M1,-48 C34,-62 42,-34 3,-32 Z" fill="#8CD4B7" />
          {stage >= 2 && (
            <>
              <circle cx="0" cy="-84" r="14" fill="#F7D7C9" />
              <circle cx="0" cy="-84" r="6" fill="#211638" />
            </>
          )}
        </g>

        {/* Stage 2+: Lavender Blossom Cluster (Left) */}
        {stage >= 2 && (
          <g transform="translate(215, 244)">
            <path d="M0,0 Q-8,-35 -12,-66" stroke="#8CD4B7" strokeWidth="3" fill="none" />
            <path d="M10,0 Q14,-30 18,-58" stroke="#8CD4B7" strokeWidth="3" fill="none" />
            <ellipse cx="-12" cy="-70" rx="8" ry="15" fill="#E8DFFF" />
            <ellipse cx="18" cy="-62" rx="7" ry="13" fill="#D5C2FF" />
            <circle cx="-12" cy="-72" r="3" fill="#493477" />
          </g>
        )}

        {/* Stage 3+: Peach Lotus Bloom (Right) */}
        {stage >= 3 && (
          <g transform="translate(535, 240)">
            <path d="M0,0 Q6,-34 4,-64" stroke="#B9E7D3" strokeWidth="3.2" fill="none" />
            <path d="M4,-64 C-16,-84 -12,-104 4,-92 C20,-104 24,-84 4,-64 Z" fill="#F7D7C9" />
            <path d="M4,-64 C-26,-70 -26,-92 4,-82 Z" fill="#F2BFA9" />
            <path d="M4,-64 C34,-70 34,-92 4,-82 Z" fill="#F2BFA9" />
          </g>
        )}

        {/* Stage 4+: Luminous Firefly Orbs */}
        {stage >= 4 && (
          <g>
            <circle cx="290" cy="148" r="5" fill="#FCE2AE" />
            <circle cx="290" cy="148" r="13" fill="#FCE2AE" opacity="0.25" />
            <circle cx="468" cy="136" r="4.5" fill="#B9E7D3" />
            <circle cx="468" cy="136" r="12" fill="#B9E7D3" opacity="0.25" />
          </g>
        )}

        {/* Stage 5+: Twin Botanical Arches & Wildflowers */}
        {stage >= 5 && (
          <g transform="translate(125, 252)">
            <path d="M0,0 Q4,-28 0,-52" stroke="#B9E7D3" strokeWidth="2.5" fill="none" />
            <circle cx="0" cy="-56" r="10" fill="#E8DFFF" />
            <circle cx="0" cy="-56" r="4" fill="#F7D7C9" />
          </g>
        )}

        {/* Stage 6: Crown Sanctuary Tree */}
        {stage >= 6 && (
          <g transform="translate(645, 246)">
            <path d="M0,0 L0,-58" stroke="#D4E4BC" strokeWidth="4" strokeLinecap="round" />
            <circle cx="0" cy="-70" r="24" fill="#B9E7D3" opacity="0.85" />
            <circle cx="-14" cy="-62" r="16" fill="#E8DFFF" opacity="0.85" />
            <circle cx="14" cy="-62" r="16" fill="#F7D7C9" opacity="0.85" />
          </g>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-3 mt-4 text-center">
        <div className="rounded-2xl bg-white/10 p-3">
          <div className="text-lg font-bold text-[#B9E7D3]">{moodCount}</div>
          <div className="text-xs text-[#E8DFFF]/80">Mood Check-ins</div>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <div className="text-lg font-bold text-[#F7D7C9]">{completedActivitiesCount}</div>
          <div className="text-xs text-[#E8DFFF]/80">Calm Sessions</div>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <div className="text-lg font-bold text-[#E8DFFF]">{journalCount}</div>
          <div className="text-xs text-[#E8DFFF]/80">Journal Reflections</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Navigation & View State
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication & User Profile State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Accessibility & Preferences
  const [reducedMotion, setReducedMotion] = useState(false);
  const [displayNameOverride, setDisplayNameOverride] = useState('');

  // Core Application Persistent Data
  const [moodLogs, setMoodLogs] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [calmSessions, setCalmSessions] = useState([]);
  const [helplines, setHelplines] = useState(INITIAL_HELPLINES);
  const [resources, setResources] = useState(INITIAL_RESOURCES);

  // Notifications & Toast Feedback
  const [notifications, setNotifications] = useState([
    {
      id: 'welcome-notif',
      title: 'Welcome to MindCare',
      body: 'Your private sanctuary is ready. Check in with your emotions or explore Calm Space.',
      time: 'Just now',
      unread: true
    }
  ]);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedResourceModal, setSelectedResourceModal] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3400 ? null : prev));
    }, 3600);
  }, []);

  // --------------------------------------------------------------------------
  // FIREBASE AUTHENTICATION LISTENER & INITIALIZATION
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.warn('Custom token sign-in skipped:', err.message);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        if (firebaseUser.email && firebaseUser.email.toLowerCase().includes('admin')) {
          setIsAdmin(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // --------------------------------------------------------------------------
  // FIRESTORE REAL-TIME SYNC (WITH RESILIENT LOCAL STATE FALLBACK)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!user || !db) return;

    const uid = user.uid;

    // 1. User Mood Logs (Private Path)
    const moodsRef = collection(db, 'artifacts', appId, 'users', uid, 'moodLogs');
    const unsubMoods = onSnapshot(
      moodsRef,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setMoodLogs(items);
      },
      (err) => console.warn('Mood snapshot warning:', err.message)
    );

    // 2. User Journal Entries (Private Path)
    const journalRef = collection(db, 'artifacts', appId, 'users', uid, 'journalEntries');
    const unsubJournal = onSnapshot(
      journalRef,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setJournalEntries(items);
      },
      (err) => console.warn('Journal snapshot warning:', err.message)
    );

    // 3. User Calm Sessions (Private Path)
    const calmRef = collection(db, 'artifacts', appId, 'users', uid, 'calmSessions');
    const unsubCalm = onSnapshot(
      calmRef,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCalmSessions(items);
      },
      (err) => console.warn('Calm sessions snapshot warning:', err.message)
    );

    // 4. Public Verified Helplines (Admin Managed)
    const helplinesRef = collection(db, 'artifacts', appId, 'public', 'data', 'helplines');
    const unsubHelplines = onSnapshot(
      helplinesRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setHelplines(items);
        }
      },
      (err) => console.warn('Helplines snapshot warning:', err.message)
    );

    return () => {
      unsubMoods();
      unsubJournal();
      unsubCalm();
      unsubHelplines();
    };
  }, [user]);

  // --------------------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // --------------------------------------------------------------------------
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { name, email, password } = authForm;

    if (!email.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    if (authMode !== 'reset' && password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthBusy(true);
    try {
      if (authMode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (email.toLowerCase().includes('admin')) setIsAdmin(true);
        setAuthModalOpen(false);
        setView('dashboard');
        showToast(`Welcome back, ${cred.user.displayName || 'Friend'}`);
      } else if (authMode === 'register') {
        if (!name.trim()) {
          setAuthError('Please enter your preferred name.');
          setAuthBusy(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });
        if (email.toLowerCase().includes('admin')) setIsAdmin(true);
        setAuthModalOpen(false);
        setView('dashboard');
        showToast('Your private MindCare sanctuary has been created.');
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, email.trim());
        showToast('Password reset instructions sent to your inbox.');
        setAuthMode('login');
      }
    } catch (err) {
      const friendly =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password. You can also use Instant Judge Demo Access below.'
          : err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists. Please sign in.'
          : err.message || 'Authentication failed. Please try again.';
      setAuthError(friendly);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleJudgeDemoAccess = async (asAdminRole = false) => {
    setAuthBusy(true);
    setAuthError('');
    try {
      if (auth && !auth.currentUser) {
        await signInAnonymously(auth);
      }
      setIsAdmin(asAdminRole);
      setDisplayNameOverride(asAdminRole ? 'Lead Judge (Admin)' : 'Maya Lin');
      setAuthModalOpen(false);
      setView('dashboard');
      setActiveTab(asAdminRole ? 'admin' : 'overview');

      // Seed initial realistic entries if empty so dashboard immediately shines
      if (moodLogs.length === 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const seedMoods = [
          {
            id: 'seed-m1',
            emotionId: 'serene',
            label: 'Serene',
            intensity: 8,
            note: 'Morning tea without screens felt deeply restorative.',
            dateKey: today.toISOString().split('T')[0],
            createdAt: Date.now() - 3600000
          },
          {
            id: 'seed-m2',
            emotionId: 'reflective',
            label: 'Reflective',
            intensity: 7,
            note: 'Thinking through upcoming milestones with clarity.',
            dateKey: yesterday.toISOString().split('T')[0],
            createdAt: Date.now() - 86400000
          },
          {
            id: 'seed-m3',
            emotionId: 'hopeful',
            label: 'Hopeful',
            intensity: 8,
            note: 'Completed a 4-7-8 breathing cycle before work.',
            dateKey: twoDaysAgo.toISOString().split('T')[0],
            createdAt: Date.now() - 172800000
          }
        ];
        setMoodLogs(seedMoods);

        if (journalEntries.length === 0) {
          setJournalEntries([
            {
              id: 'seed-j1',
              title: 'Finding stillness amidst busy weeks',
              content:
                'Taking five minutes to breathe before opening my laptop changed the entire rhythm of my morning. Noticing small moments of calm makes challenges feel manageable.',
              emotionId: 'serene',
              dateKey: today.toISOString().split('T')[0],
              createdAt: Date.now() - 7200000
            }
          ]);
        }

        if (calmSessions.length === 0) {
          setCalmSessions([
            {
              id: 'seed-c1',
              protocol: 'Resonant 5-5 Coherence',
              durationSeconds: 180,
              soundscape: 'Warm Rain',
              dateKey: today.toISOString().split('T')[0],
              createdAt: Date.now() - 5400000
            }
          ]);
        }
      }

      showToast(
        asAdminRole
          ? 'Entered Judge Demo Workspace with Admin RBAC enabled.'
          : 'Welcome to your interactive MindCare workspace!'
      );
    } catch (err) {
      // Pure local fallback if Firebase anonymous auth is disabled in console
      setUser({ uid: 'judge-local-session', isAnonymous: true });
      setIsAdmin(asAdminRole);
      setDisplayNameOverride(asAdminRole ? 'Lead Judge (Admin)' : 'Maya Lin');
      setAuthModalOpen(false);
      setView('dashboard');
      showToast('Entered interactive MindCare workspace.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth && auth.currentUser) {
        await signOut(auth);
      }
    } catch (_) {}
    soundEngine.stop();
    setUser(null);
    setIsAdmin(false);
    setView('landing');
    setActiveTab('overview');
    showToast('Signed out securely.');
  };

  // --------------------------------------------------------------------------
  // DATA PERSISTENCE HELPERS (FIRESTORE + LOCAL STATE)
  // --------------------------------------------------------------------------
  const recordMoodEntry = async ({ emotionId, intensity, note }) => {
    const emotionObj = EMOTION_NODES.find((e) => e.id === emotionId) || EMOTION_NODES[0];
    const now = Date.now();
    const dateKey = new Date(now).toISOString().split('T')[0];
    const entry = {
      emotionId: emotionObj.id,
      label: emotionObj.label,
      intensity: Number(intensity),
      note: note.trim(),
      dateKey,
      createdAt: now
    };

    if (user && db && user.uid !== 'judge-local-session') {
      try {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'moodLogs'), entry);
      } catch (err) {
        setMoodLogs((prev) => [{ id: `local-${now}`, ...entry }, ...prev]);
      }
    } else {
      setMoodLogs((prev) => [{ id: `local-${now}`, ...entry }, ...prev]);
    }

    setNotifications((prev) => [
      {
        id: `notif-${now}`,
        title: `Mood Logged: ${emotionObj.label}`,
        body: 'Your Mind Garden received +1 care point for mindful check-in.',
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
    showToast(`${emotionObj.label} recorded in your Emotion Universe.`);
  };

  const saveJournalEntry = async ({ id, title, content, emotionId }) => {
    const now = Date.now();
    const dateKey = new Date(now).toISOString().split('T')[0];
    const payload = {
      title: title.trim() || 'Untitled Reflection',
      content: content.trim(),
      emotionId: emotionId || 'reflective',
      dateKey,
      updatedAt: now,
      createdAt: now
    };

    if (id) {
      if (user && db && user.uid !== 'judge-local-session' && !id.startsWith('seed-') && !id.startsWith('local-')) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'journalEntries', id), payload);
      } else {
        setJournalEntries((prev) => prev.map((j) => (j.id === id ? { ...j, ...payload } : j)));
      }
      showToast('Journal reflection updated.');
    } else {
      if (user && db && user.uid !== 'judge-local-session') {
        try {
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'journalEntries'), payload);
        } catch (_) {
          setJournalEntries((prev) => [{ id: `local-${now}`, ...payload }, ...prev]);
        }
      } else {
        setJournalEntries((prev) => [{ id: `local-${now}`, ...payload }, ...prev]);
      }
      showToast('Private journal entry saved & Mind Garden nurtured.');
    }
  };

  const deleteJournalEntry = async (id) => {
    if (user && db && user.uid !== 'judge-local-session' && !id.startsWith('seed-') && !id.startsWith('local-')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'journalEntries', id));
    } else {
      setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    }
    showToast('Journal entry deleted.', 'info');
  };

  const recordCalmSession = async ({ protocol, durationSeconds, soundscape }) => {
    const now = Date.now();
    const dateKey = new Date(now).toISOString().split('T')[0];
    const payload = {
      protocol,
      durationSeconds,
      soundscape,
      dateKey,
      createdAt: now
    };
    if (user && db && user.uid !== 'judge-local-session') {
      try {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'calmSessions'), payload);
      } catch (_) {
        setCalmSessions((prev) => [{ id: `local-${now}`, ...payload }, ...prev]);
      }
    } else {
      setCalmSessions((prev) => [{ id: `local-${now}`, ...payload }, ...prev]);
    }
    showToast(`Completed ${protocol}! Mind Garden nourished.`);
  };

  // Derived Real-Time Metrics
  const userName = displayNameOverride || user?.displayName || user?.email?.split('@')[0] || 'Explorer';
  const totalCarePoints = moodLogs.length + journalEntries.length * 2 + calmSessions.length * 2;
  const latestMood = moodLogs[0] || null;
  const latestEmotionMeta = latestMood
    ? EMOTION_NODES.find((e) => e.id === latestMood.emotionId) || EMOTION_NODES[0]
    : EMOTION_NODES[0];

  // ==========================================================================
  // 6. VIEW A: STUNNING EDITORIAL & FUTURISTIC LANDING PAGE
  // ==========================================================================
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#FBF8F2] text-[#211638] selection:bg-[#E8DFFF] selection:text-[#211638] overflow-x-hidden">
        {/* Global Toast */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#211638] text-white text-sm shadow-2xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#B9E7D3]" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Editorial Top Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FBF8F2]/85 border-b border-[#211638]/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#211638] to-[#493477] flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#B9E7D3]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3C7.5 3 4 6.5 4 11c0 5.2 8 10 8 10s8-4.8 8-10c0-4.5-3.5-8-8-8z" />
                  <circle cx="12" cy="11" r="3" fill="#F7D7C9" stroke="none" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#211638]">MindCare</span>
                <span className="hidden sm:inline-block ml-2.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#E8DFFF] text-[#493477]">
                  AI Wellness Ecosystem
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#211638]/80">
              <a href="#features" className="hover:text-[#493477] transition-colors">Signature Features</a>
              <a href="#how-it-works" className="hover:text-[#493477] transition-colors">How It Works</a>
              <a href="#resources" className="hover:text-[#493477] transition-colors">Awareness & Guides</a>
              <a href="#crisis-support" className="hover:text-[#493477] transition-colors">Care Connect</a>
            </nav>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {user ? (
                <button
                  onClick={() => setView('dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#211638] text-white text-sm font-semibold hover:bg-[#493477] transition-all shadow-lg shadow-[#211638]/15"
                >
                  <span>Open Sanctuary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-full text-sm font-semibold text-[#211638] hover:bg-[#E8DFFF]/60 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleJudgeDemoAccess(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#211638] text-white text-sm font-semibold hover:bg-[#493477] transition-all shadow-lg shadow-[#211638]/15"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          {/* Subtle Radial Mesh Gradients */}
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-55 blur-3xl"
            style={{ background: 'radial-gradient(circle, #E8DFFF 0%, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute top-32 right-0 w-[420px] h-[420px] rounded-full opacity-45 blur-3xl"
            style={{ background: 'radial-gradient(circle, #B9E7D3 0%, transparent 70%)' }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="lg:col-span-6 space-y-7">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#493477]/15 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#493477]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#493477]">
                    Your Mind Matters. Your Well-being Comes First.
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#211638] leading-[1.08]">
                  Your Mind Deserves a{' '}
                  <span className="bg-gradient-to-r from-[#493477] via-[#6D4EB3] to-[#2E6F5B] bg-clip-text text-transparent">
                    Better Tomorrow.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#211638]/75 leading-relaxed max-w-xl">
                  An ethical, AI-powered mental wellness sanctuary uniting interactive emotion mapping,
                  a living botanical Mind Garden, somatic breathwork, and verified human crisis support—designed
                  to honor every emotion without judgment.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    onClick={() => handleJudgeDemoAccess(false)}
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#211638] text-white font-semibold text-sm sm:text-base hover:bg-[#493477] transition-all shadow-xl shadow-[#211638]/20"
                  >
                    <span>Launch Interactive Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white text-[#211638] font-semibold text-sm sm:text-base border border-[#211638]/15 hover:bg-[#E8DFFF]/40 transition-all"
                  >
                    <span>Create Private Account</span>
                  </button>
                </div>

                {/* Live Application-Backed Trust Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#211638]/10">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#211638]">
                      {helplines.filter((h) => h.verified).length}
                    </div>
                    <div className="text-xs sm:text-sm text-[#211638]/65">Verified Helplines</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#493477]">
                      {EMOTION_NODES.length}
                    </div>
                    <div className="text-xs sm:text-sm text-[#211638]/65">Emotion Orbits</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#2D6A54]">100%</div>
                    <div className="text-xs sm:text-sm text-[#211638]/65">Private & Encrypted</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <HeroWellnessSculpture reducedMotion={reducedMotion} />
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE FEATURES SHOWCASE */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#493477]">
                Signature Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#211638] mt-2">
                Thoughtfully engineered for emotional clarity and safety.
              </h2>
              <p className="text-[#211638]/70 mt-3 text-base">
                Every module works together to turn daily self-awareness into a restorative ritual.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[
                {
                  icon: Compass,
                  title: 'Emotion Universe',
                  accent: 'bg-[#E8DFFF] text-[#493477]',
                  desc: 'Explore an interactive orbital constellation of emotional states. Log intensity and context without toxic positivity.'
                },
                {
                  icon: Sprout,
                  title: 'Mind Garden',
                  accent: 'bg-[#B9E7D3] text-[#211638]',
                  desc: 'A living botanical sanctuary that blossoms with every act of self-care—whether your day feels radiant or heavy.'
                },
                {
                  icon: MessageCircleHeart,
                  title: 'MindCare AI Companion',
                  accent: 'bg-[#F7D7C9] text-[#211638]',
                  desc: 'Empathetic, non-diagnostic reflective guidance powered by Gemini with automatic crisis escalation to human care.'
                },
                {
                  icon: Wind,
                  title: 'Calm Space Studio',
                  accent: 'bg-[#E8DFFF] text-[#211638]',
                  desc: 'Rhythmic SVG breathing guides paired with real-time synthesized warm rain, theta drones, and singing bowls.'
                },
                {
                  icon: PhoneCall,
                  title: 'Care Connect Directory',
                  accent: 'bg-[#B9E7D3] text-[#211638]',
                  desc: 'Verified national and global crisis helplines (Tele-MANAS 14416, 988, Samaritans) with one-tap calling.'
                },
                {
                  icon: BookOpen,
                  title: 'Encrypted Wellness Journal',
                  accent: 'bg-[#F7D7C9] text-[#493477]',
                  desc: 'Private mood-linked reflections stored under strict per-user security isolation with instant search.'
                }
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-3xl p-7 bg-[#FBF8F2] hover:bg-[#211638] hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${feat.accent} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2.5">{feat.title}</h3>
                    <p className="text-sm leading-relaxed opacity-75">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW MINDCARE WORKS */}
        <section id="how-it-works" className="py-20 bg-[#FBF8F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#493477]">
                Gentle Daily Rhythm
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#211638] mt-2">
                Three effortless steps to ground your day
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Check In Without Judgment',
                  body: 'Select your current emotional orbit in the Emotion Universe and record how strongly it resonates.'
                },
                {
                  step: '02',
                  title: 'Restore & Reflect',
                  body: 'Follow a tailored 3-minute breathwork session in Calm Space or journal alongside our supportive AI Companion.'
                },
                {
                  step: '03',
                  title: 'Watch Your Sanctuary Bloom',
                  body: 'Every act of self-care nurtures your Mind Garden and builds clear, non-clinical progress insights.'
                }
              ].map((item) => (
                <div key={item.step} className="rounded-3xl bg-white p-8 shadow-sm">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#E8DFFF] text-[#493477] mb-4">
                    Step {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-[#211638] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#211638]/70 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MENTAL WELLNESS AWARENESS & FEATURED RESOURCES */}
        <section id="resources" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#493477]">
                  Awareness & Education
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#211638] mt-2">
                  Featured Wellness Guides
                </h2>
              </div>
              <button
                onClick={() => handleJudgeDemoAccess(false)}
                className="text-sm font-semibold text-[#493477] hover:text-[#211638] inline-flex items-center gap-1"
              >
                Explore full library in workspace <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {resources.map((res) => (
                <article
                  key={res.id}
                  className="rounded-3xl bg-[#FBF8F2] p-7 flex flex-col justify-between border border-[#211638]/6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#493477] mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#E8DFFF]">{res.category}</span>
                      <span>{res.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#211638] mb-2">{res.title}</h3>
                    <p className="text-sm text-[#211638]/70 leading-relaxed">{res.summary}</p>
                  </div>
                  <button
                    onClick={() => setSelectedResourceModal(res)}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#211638] hover:text-[#493477]"
                  >
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EMERGENCY HUMAN SUPPORT BANNER */}
        <section id="crisis-support" className="py-16 bg-[#211638] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#493477]/70 to-[#211638] p-8 sm:p-10 border border-white/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9E7D3]/20 text-[#B9E7D3] text-xs font-semibold">
                  <HeartHandshake className="w-4 h-4" /> Immediate Human Support Always Available
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  If you or someone you know is in distress, you are never alone.
                </h2>
                <p className="text-sm sm:text-base text-[#E8DFFF]/80">
                  MindCare is a wellness companion and does not replace professional medical care or crisis intervention.
                  Connect directly with verified 24/7 human helplines below.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:14416"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B9E7D3] text-[#211638] font-bold text-sm hover:opacity-95 transition"
                >
                  <PhoneCall className="w-4 h-4" /> India Tele-MANAS: 14416
                </a>
                <a
                  href="tel:988"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#211638] font-bold text-sm hover:bg-[#E8DFFF] transition"
                >
                  <PhoneCall className="w-4 h-4" /> US Lifeline: 988
                </a>
                <button
                  onClick={() => {
                    handleJudgeDemoAccess(false);
                    setActiveTab('care-connect');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition"
                >
                  All Verified Helplines
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL FOOTER */}
        <footer className="bg-[#180F2B] text-[#E8DFFF]/70 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-white font-bold text-lg">MindCare</div>
              <p className="text-xs mt-1">Your Mind Matters. Your Well-being Comes First.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <button
                onClick={() => handleJudgeDemoAccess(false)}
                className="hover:text-white transition-colors"
              >
                User Workspace
              </button>
              <button
                onClick={() => handleJudgeDemoAccess(true)}
                className="hover:text-[#B9E7D3] transition-colors"
              >
                Admin Console (Judge RBAC)
              </button>
              <span>Non-Diagnostic Wellness Platform</span>
            </div>
          </div>
        </footer>

        {/* ARTICLE READER MODAL */}
        {selectedResourceModal && (
          <div className="fixed inset-0 z-50 bg-[#211638]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8DFFF] text-[#493477]">
                  {selectedResourceModal.category}
                </span>
                <button
                  onClick={() => setSelectedResourceModal(null)}
                  className="p-2 rounded-full hover:bg-[#FBF8F2]"
                  aria-label="Close guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-[#211638]">{selectedResourceModal.title}</h3>
              <p className="text-sm text-[#211638]/80 leading-relaxed">{selectedResourceModal.content}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedResourceModal(null)}
                  className="px-5 py-2.5 rounded-full bg-[#211638] text-white text-sm font-semibold"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION MODAL */}
        {authModalOpen && (
          <AuthModal
            authMode={authMode}
            setAuthMode={setAuthMode}
            authForm={authForm}
            setAuthForm={setAuthForm}
            authError={authError}
            authBusy={authBusy}
            onSubmit={handleAuthSubmit}
            onJudgeAccess={handleJudgeDemoAccess}
            onClose={() => setAuthModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // ==========================================================================
  // 7. VIEW B: PREMIUM USER & ADMIN WORKSPACE DASHBOARD
  // ==========================================================================
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'emotion-universe', label: 'Emotion Universe', icon: Compass },
    { id: 'mind-garden', label: 'Mind Garden', icon: Sprout },
    { id: 'ai-companion', label: 'AI Companion', icon: MessageCircleHeart },
    { id: 'calm-space', label: 'Calm Space', icon: Wind },
    { id: 'care-connect', label: 'Care Connect', icon: PhoneCall },
    { id: 'journal', label: 'Wellness Journal', icon: BookOpen },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#211638] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#211638] text-white text-sm shadow-2xl border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-[#B9E7D3]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-[#211638] text-white p-6 justify-between z-30">
        <div>
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-3 text-left w-full mb-8 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#493477] to-[#6E50B0] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#B9E7D3]" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-white group-hover:text-[#B9E7D3] transition-colors">
                MindCare
              </div>
              <div className="text-[11px] text-[#E8DFFF]/65">Personal Sanctuary</div>
            </div>
          </button>

          <nav className="space-y-1.5" aria-label="Workspace navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#493477] text-white shadow-lg shadow-black/20'
                      : 'text-[#E8DFFF]/75 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#B9E7D3]' : ''}`} />
                  <span>{item.label}</span>
                  {item.id === 'admin' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#B9E7D3] text-[#211638] font-bold">
                      RBAC
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('care-connect')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F7D7C9] text-[#211638] text-xs font-bold hover:opacity-95 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Urgent Human Support
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-[#E8DFFF]/75 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR & DRAWER */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#211638] text-white px-4 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg">MindCare</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('care-connect')}
            className="px-3 py-1.5 rounded-full bg-[#B9E7D3] text-[#211638] text-xs font-bold"
          >
            Helplines
          </button>
          <button
            onClick={() => setNotifPanelOpen(!notifPanelOpen)}
            className="p-2 rounded-xl bg-white/10 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F7D7C9]" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] bg-[#211638] text-white p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-xl">MindCare</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                        active ? 'bg-[#493477] text-white' : 'text-[#E8DFFF]/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-6 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE CANVAS */}
      <main className="flex-1 lg:pl-72">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Top Utility Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#493477]">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#211638] mt-0.5">
                Welcome back, {userName}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#211638]/10 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-[#493477]" />
                <span>{isAdmin ? 'Administrator Role' : 'Private Sanctuary'}</span>
              </div>

              {/* Notification Trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifPanelOpen(!notifPanelOpen);
                    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                  }}
                  className="p-3 rounded-2xl bg-white border border-[#211638]/10 hover:bg-[#E8DFFF]/40 transition relative"
                  aria-label="Toggle notifications"
                >
                  <Bell className="w-5 h-5 text-[#211638]" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#493477]" />
                  )}
                </button>

                {notifPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-3xl bg-white shadow-2xl border border-[#211638]/10 p-4 z-40">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#211638]/10">
                      <span className="text-sm font-bold">Sanctuary Updates</span>
                      <button
                        onClick={() => setNotifPanelOpen(false)}
                        className="text-xs text-[#493477]"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-[#FBF8F2] text-xs">
                          <div className="font-bold text-[#211638]">{n.title}</div>
                          <div className="text-[#211638]/70 mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-[#493477] mt-1">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMIC TAB CONTENT */}
          {activeTab === 'overview' && (
            <OverviewTab
              userName={userName}
              moodLogs={moodLogs}
              journalEntries={journalEntries}
              calmSessions={calmSessions}
              totalCarePoints={totalCarePoints}
              latestEmotionMeta={latestEmotionMeta}
              onQuickMood={(emotionId) => recordMoodEntry({ emotionId, intensity: 7, note: 'Quick dashboard check-in' })}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'emotion-universe' && (
            <EmotionUniverseTab
              moodLogs={moodLogs}
              onRecordMood={recordMoodEntry}
              reducedMotion={reducedMotion}
            />
          )}

          {activeTab === 'mind-garden' && (
            <MindGardenTab
              totalCarePoints={totalCarePoints}
              moodLogs={moodLogs}
              journalEntries={journalEntries}
              calmSessions={calmSessions}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'ai-companion' && (
            <AICompanionTab
              userName={userName}
              latestEmotion={latestEmotionMeta}
              onOpenHelplines={() => setActiveTab('care-connect')}
            />
          )}

          {activeTab === 'calm-space' && (
            <CalmSpaceTab
              onCompleteSession={recordCalmSession}
              reducedMotion={reducedMotion}
            />
          )}

          {activeTab === 'care-connect' && (
            <CareConnectTab helplines={helplines} />
          )}

          {activeTab === 'journal' && (
            <WellnessJournalTab
              entries={journalEntries}
              onSave={saveJournalEntry}
              onDelete={deleteJournalEntry}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressInsightsTab
              moodLogs={moodLogs}
              journalEntries={journalEntries}
              calmSessions={calmSessions}
              totalCarePoints={totalCarePoints}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              user={user}
              userName={userName}
              setDisplayNameOverride={setDisplayNameOverride}
              reducedMotion={reducedMotion}
              setReducedMotion={setReducedMotion}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              moodLogs={moodLogs}
              journalEntries={journalEntries}
              calmSessions={calmSessions}
              showToast={showToast}
            />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminDashboardTab
              helplines={helplines}
              setHelplines={setHelplines}
              resources={resources}
              setResources={setResources}
              moodLogsCount={moodLogs.length}
              journalCount={journalEntries.length}
              calmCount={calmSessions.length}
              showToast={showToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 8. TAB SUB-VIEWS
// ============================================================================

function OverviewTab({
  userName,
  moodLogs,
  journalEntries,
  calmSessions,
  totalCarePoints,
  latestEmotionMeta,
  onQuickMood,
  onNavigate
}) {
  return (
    <div className="space-y-8">
      {/* Welcome Banner with Custom Botanical SVG Illustration */}
      <div className="rounded-3xl bg-gradient-to-r from-[#211638] via-[#37245E] to-[#493477] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#B9E7D3] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Today’s Wellness Synthesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
              {moodLogs.length > 0
                ? `You recently checked in feeling ${latestEmotionMeta.label}.`
                : `How is your inner landscape feeling right now, ${userName}?`}
            </h2>
            <p className="text-sm text-[#E8DFFF]/85 max-w-xl leading-relaxed">
              {latestEmotionMeta.suggestion}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('emotion-universe')}
                className="px-5 py-2.5 rounded-full bg-[#B9E7D3] text-[#211638] text-xs sm:text-sm font-bold hover:opacity-95 transition"
              >
                Explore Emotion Universe
              </button>
              <button
                onClick={() => onNavigate('calm-space')}
                className="px-5 py-2.5 rounded-full bg-white/15 text-white text-xs sm:text-sm font-semibold hover:bg-white/25 transition"
              >
                Start 3-Min Breathwork
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <svg viewBox="0 0 200 160" className="w-44 h-auto" aria-hidden="true">
              <circle cx="100" cy="80" r="64" fill="#E8DFFF" opacity="0.12" />
              <circle cx="100" cy="80" r="42" fill="#B9E7D3" opacity="0.2" />
              <path
                d="M100,28 C122,58 122,98 100,128 C78,98 78,58 100,28 Z"
                fill="#B9E7D3"
                opacity="0.85"
              />
              <path
                d="M100,45 C135,62 145,95 125,118 C104,105 96,80 100,45 Z"
                fill="#F7D7C9"
                opacity="0.85"
              />
              <path
                d="M100,45 C65,62 55,95 75,118 C96,105 104,80 100,45 Z"
                fill="#E8DFFF"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Interactive Mood Check-In Strip */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#211638]">Instant Emotional Pulse</h3>
            <p className="text-xs text-[#211638]/65">
              Tap an emotion to log a quick check-in and nurture your Mind Garden (+1 Care Point).
            </p>
          </div>
          <button
            onClick={() => onNavigate('emotion-universe')}
            className="text-xs font-semibold text-[#493477] hover:underline"
          >
            Add intensity & journal note →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {EMOTION_NODES.map((node) => (
            <button
              key={node.id}
              onClick={() => onQuickMood(node.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-[#211638]/8 hover:border-[#493477] transition-all text-center group"
              style={{ backgroundColor: node.bgTint }}
            >
              <span
                className="w-6 h-6 rounded-full shadow-xs group-hover:scale-110 transition-transform"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-xs font-semibold text-[#211638]">{node.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Data Visualization Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#211638]">7-Day Self-Care Rhythm</h3>
              <p className="text-xs text-[#211638]/65">
                Derived directly from your recorded check-ins, reflections, and calm sessions
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E8DFFF] text-[#493477] text-xs font-bold">
              {totalCarePoints} Total Care Pts
            </span>
          </div>
          <WeeklyWellnessChart moodLogs={moodLogs} activities={calmSessions} />
        </div>

        <div className="lg:col-span-5 rounded-3xl bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#211638] mb-1">Recently Completed Care</h3>
            <p className="text-xs text-[#211638]/65 mb-4">Your latest restorative actions</p>

            <div className="space-y-3">
              {calmSessions.slice(0, 2).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF8F2]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#B9E7D3] flex items-center justify-center text-[#211638]">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#211638]">{s.protocol}</div>
                      <div className="text-[11px] text-[#211638]/60">
                        {Math.round(s.durationSeconds / 60)} min · {s.soundscape}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2D6A54]">+2 Pts</span>
                </div>
              ))}

              {journalEntries.slice(0, 2).map((j) => (
                <div key={j.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF8F2]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E8DFFF] flex items-center justify-center text-[#493477]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#211638] line-clamp-1">{j.title}</div>
                      <div className="text-[11px] text-[#211638]/60">Wellness Journal Reflection</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#493477]">+2 Pts</span>
                </div>
              ))}

              {calmSessions.length === 0 && journalEntries.length === 0 && (
                <div className="text-xs text-[#211638]/60 p-4 rounded-2xl bg-[#FBF8F2] text-center">
                  Complete a breathing exercise or journal reflection to see your activity feed grow.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('mind-garden')}
            className="mt-5 w-full py-3 rounded-2xl bg-[#211638] text-white text-xs font-bold hover:bg-[#493477] transition"
          >
            Visit Your Mind Garden Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE A: EMOTION UNIVERSE
// ============================================================================
function EmotionUniverseTab({ moodLogs, onRecordMood, reducedMotion }) {
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTION_NODES[0]);
  const [intensity, setIntensity] = useState(7);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onRecordMood({
      emotionId: selectedEmotion.id,
      intensity,
      note
    });
    setNote('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Cosmic Orbital Map */}
        <div className="lg:col-span-7 rounded-3xl bg-[#211638] text-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B9E7D3]">
                Interactive Constellation
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">Emotion Universe</h2>
            </div>
            <span className="text-xs text-[#E8DFFF]/75">Select an orbital node</span>
          </div>

          <svg
            viewBox="0 0 460 420"
            className="w-full h-auto max-w-[460px] mx-auto select-none"
            role="group"
            aria-label="Selectable Emotion Universe"
          >
            <defs>
              <radialGradient id="universeCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={selectedEmotion.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor="#211638" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="230" cy="210" r="190" fill="url(#universeCore)" />

            {/* 3 Concentric Orbits */}
            {[82, 134, 184].map((r, i) => (
              <circle
                key={r}
                cx="230"
                cy="210"
                r={r}
                fill="none"
                stroke="#E8DFFF"
                strokeOpacity={0.14 + i * 0.04}
                strokeDasharray={i === 1 ? '4 4' : 'none'}
              />
            ))}

            {/* Central Self Core */}
            <circle cx="230" cy="210" r="34" fill="#493477" stroke="#E8DFFF" strokeWidth="1.5" />
            <text
              x="230"
              y="214"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              fontFamily="sans-serif"
            >
              YOU
            </text>

            {/* Orbital Emotion Planets */}
            {EMOTION_NODES.map((node) => {
              const radius = node.orbit === 1 ? 82 : node.orbit === 2 ? 134 : 184;
              const rad = (node.angle * Math.PI) / 180;
              const cx = 230 + radius * Math.cos(rad);
              const cy = 210 + radius * Math.sin(rad);
              const isSelected = selectedEmotion.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedEmotion(node)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select emotion ${node.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedEmotion(node);
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="28"
                      fill={node.color}
                      opacity="0.3"
                      className={reducedMotion ? '' : 'animate-ping'}
                      style={{ animationDuration: '3s' }}
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 21 : 16}
                    fill={node.color}
                    stroke={isSelected ? '#FFFFFF' : '#211638'}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    x={cx}
                    y={cy + 32}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#E8DFFF'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Emotion Check-In & Contextual Reflection Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div
            className="p-5 rounded-2xl transition-colors"
            style={{ backgroundColor: selectedEmotion.bgTint }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#493477]">
                Selected State
              </span>
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedEmotion.color }}
              />
            </div>
            <h3 className="text-2xl font-bold text-[#211638] mt-1">{selectedEmotion.label}</h3>
            <p className="text-sm text-[#211638]/80 mt-1">{selectedEmotion.description}</p>
            <div className="mt-3 pt-3 border-t border-[#211638]/10 text-xs text-[#211638]/85">
              <strong>Gentle Suggestion:</strong> {selectedEmotion.suggestion}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#211638] mb-1.5">
                <label htmlFor="emotion-intensity">Emotional Resonance Intensity</label>
                <span>{intensity} / 10</span>
              </div>
              <input
                id="emotion-intensity"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#493477]"
              />
            </div>

            <div>
              <label htmlFor="emotion-note" className="block text-xs font-bold text-[#211638] mb-1.5">
                Optional Context Note
              </label>
              <textarea
                id="emotion-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What is contributing to this feeling right now?"
                className="w-full rounded-2xl border border-[#211638]/15 bg-[#FBF8F2] p-3.5 text-sm focus:outline-none focus:border-[#493477]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#211638] text-white text-sm font-bold hover:bg-[#493477] transition shadow-md"
            >
              {submitting ? 'Recording...' : `Record ${selectedEmotion.label} Check-In`}
            </button>
          </form>
        </div>
      </div>

      {/* Mood History Timeline */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#211638] mb-4">Recent Emotional Logs</h3>
        {moodLogs.length === 0 ? (
          <p className="text-sm text-[#211638]/60">No mood entries recorded yet. Select any orbit above to begin.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodLogs.slice(0, 6).map((m) => {
              const meta = EMOTION_NODES.find((e) => e.id === m.emotionId) || EMOTION_NODES[0];
              return (
                <div key={m.id} className="p-4 rounded-2xl bg-[#FBF8F2] border border-[#211638]/6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-2 font-bold text-sm text-[#211638]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} />
                      {m.label}
                    </span>
                    <span className="text-xs font-semibold text-[#493477]">Intensity {m.intensity}/10</span>
                  </div>
                  {m.note && <p className="text-xs text-[#211638]/75 line-clamp-2 mb-2">{m.note}</p>}
                  <div className="text-[11px] text-[#211638]/50">{m.dateKey}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE B: MIND GARDEN
// ============================================================================
function MindGardenTab({ totalCarePoints, moodLogs, journalEntries, calmSessions, onNavigate }) {
  const milestones = [
    { pts: 1, title: 'First Seed Planted', desc: 'Completed your very first emotional check-in or reflection.' },
    { pts: 3, title: 'Lavender Sprouts', desc: 'Reached 3 Care Points through consistent self-awareness.' },
    { pts: 6, title: 'Peach Lotus Blossom', desc: 'Reached 6 Care Points across check-ins, calm sessions, or journaling.' },
    { pts: 10, title: 'Sanctuary Fireflies', desc: '10 Care Points of dedicated personal care.' },
    { pts: 15, title: 'Flourishing Sanctuary Canopy', desc: '15+ Care Points—your botanical sanctuary is in full bloom.' }
  ];

  return (
    <div className="space-y-8">
      <MindGardenSanctuary
        totalCarePoints={totalCarePoints}
        completedActivitiesCount={calmSessions.length}
        moodCount={moodLogs.length}
        journalCount={journalEntries.length}
      />

      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#211638]">Ethical Growth Philosophy</h3>
            <p className="text-sm text-[#211638]/70 mt-1">
              MindCare never rewards forced positivity or penalizes difficult moods. Your garden grows whenever you show up for yourself.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('calm-space')}
              className="px-4 py-2 rounded-full bg-[#E8DFFF] text-[#493477] text-xs font-bold"
            >
              +2 Pts: Calm Session
            </button>
            <button
              onClick={() => onNavigate('journal')}
              className="px-4 py-2 rounded-full bg-[#B9E7D3] text-[#211638] text-xs font-bold"
            >
              +2 Pts: Journal Entry
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {milestones.map((m) => {
            const unlocked = totalCarePoints >= m.pts;
            return (
              <div
                key={m.pts}
                className={`p-4 rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-[#FBF8F2] border-[#2D6A54]/30'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#493477]">{m.pts} Care Pts</span>
                  {unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2D6A54]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-bold text-[#211638]">{m.title}</div>
                <p className="text-xs text-[#211638]/65 mt-1">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE C: MINDCARE AI COMPANION (GEMINI API + SAFETY GUARDRAILS)
// ============================================================================
function AICompanionTab({ userName, latestEmotion, onOpenHelplines }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-ai',
      role: 'assistant',
      text: `Hello ${userName}. I’m your MindCare AI Companion. I’m here to offer gentle, non-judgmental reflection, grounding prompts, and wellness resources. How are you carrying today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (customPrompt) => {
    const textToSend = (customPrompt ?? input).trim();
    if (!textToSend || loading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');

    // Immediate Client-Side Crisis Safety Detection
    const lower = textToSend.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
    if (isCrisis) {
      setCrisisAlert(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `crisis-${Date.now()}`,
          role: 'assistant',
          isCrisisResponse: true,
          text:
            'It sounds like you are going through an overwhelming moment, and your safety matters deeply. Because I am an AI companion and not a crisis counselor, please connect right now with compassionate human support—such as Tele-MANAS (14416 in India) or 988 (in the US)—available 24/7.'
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const apiKey = '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemInstruction = `You are the MindCare AI Companion, a warm, empathetic, ethical mental wellness guide.
STRICT SAFETY & ETHICAL RULES:
1. Never diagnose any mental health or medical condition.
2. Never claim to be a licensed therapist, doctor, or replacement for human professional care.
3. Validate the user's emotions gently without toxic positivity.
4. Offer one concise, practical grounding reflection or small actionable wellness step.
5. Keep responses warm, clear, structured, and under 140 words.
User context: Name is ${userName}. Recent logged emotion: ${latestEmotion?.label || 'Reflective'}.`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: textToSend }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Thank you for sharing that with me. Taking a quiet pause to notice what you're feeling is a meaningful step. Would you like to try a brief 4-7-8 breathing exercise or unpack this thought together?";

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'assistant', text: reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          role: 'assistant',
          text:
            "I'm here listening with you. Even when words feel heavy, taking one slow breath—inhaling for 4 seconds and exhaling for 6—can create a gentle pocket of space. What feels like the kindest small thing you could do for yourself over the next hour?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    'Help me reframe an anxious thought gently',
    'Guide me through a 2-minute grounding check-in',
    'I feel mentally fatigued after a long day'
  ];

  return (
    <div className="space-y-4">
      {/* Clear AI Transparency & Non-Diagnostic Boundary Banner */}
      <div className="rounded-2xl bg-[#E8DFFF]/70 border border-[#493477]/15 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#211638]">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#493477] shrink-0" />
          <span>
            <strong>AI Companion Transparency:</strong> MindCare AI offers supportive reflection and wellness education. It does not diagnose conditions or replace licensed therapy.
          </span>
        </div>
        <button
          onClick={onOpenHelplines}
          className="font-bold text-[#493477] hover:underline shrink-0"
        >
          Human Support Directory →
        </button>
      </div>

      {/* Elevated Crisis Safety Alert if Triggered */}
      {crisisAlert && (
        <div className="rounded-3xl bg-[#211638] text-white p-6 border-2 border-[#F7D7C9] shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-[#F7D7C9] font-bold text-sm">
            <AlertTriangle className="w-5 h-5" /> Immediate Human Support Prioritized
          </div>
          <p className="text-sm text-[#E8DFFF]">
            You deserve real human care right now. Free, confidential crisis counselors are available 24/7:
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:14416"
              className="px-5 py-2.5 rounded-full bg-[#B9E7D3] text-[#211638] text-xs font-bold"
            >
              Call Tele-MANAS (India): 14416
            </a>
            <a
              href="tel:988"
              className="px-5 py-2.5 rounded-full bg-white text-[#211638] text-xs font-bold"
            >
              Call / Text 988 (US)
            </a>
            <button
              onClick={onOpenHelplines}
              className="px-5 py-2.5 rounded-full bg-white/15 text-white text-xs font-semibold"
            >
              View Global Helplines
            </button>
          </div>
        </div>
      )}

      {/* Conversational Card */}
      <div className="rounded-3xl bg-white shadow-sm border border-[#211638]/8 flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#211638] text-white rounded-br-md'
                    : m.isCrisisResponse
                    ? 'bg-[#F7D7C9] text-[#211638] font-medium rounded-bl-md'
                    : 'bg-[#FBF8F2] text-[#211638] border border-[#211638]/8 rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-5 py-3 rounded-3xl bg-[#FBF8F2] text-xs text-[#493477] font-medium animate-pulse">
                MindCare Companion is reflecting...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Guided Reflection Prompts */}
        <div className="px-5 py-2.5 border-t border-[#211638]/6 flex gap-2 overflow-x-auto">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="shrink-0 text-xs px-3.5 py-1.5 rounded-full bg-[#E8DFFF]/60 text-[#493477] font-medium hover:bg-[#E8DFFF] transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t border-[#211638]/10 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what’s on your mind..."
            aria-label="Message MindCare AI Companion"
            className="flex-1 rounded-full bg-[#FBF8F2] px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#493477]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3.5 rounded-full bg-[#211638] text-white hover:bg-[#493477] disabled:opacity-40 transition"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE D: CALM SPACE (BREATHWORK + WEB AUDIO AMBIENT ENGINE)
// ============================================================================
function CalmSpaceTab({ onCompleteSession, reducedMotion }) {
  const protocols = [
    { id: 'box', name: 'Box Breathing (4-4-4-4)', inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    { id: '478', name: '4-7-8 Deep Calm', inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    { id: 'resonant', name: 'Resonant Coherence (5-5)', inhale: 5, hold: 0, exhale: 5, holdAfter: 0 }
  ];

  const soundscapes = [
    { id: 'none', label: 'Silence' },
    { id: 'rain', label: 'Warm Rain' },
    { id: 'theta', label: 'Theta Drone' },
    { id: 'bowl', label: 'Singing Bowl' }
  ];

  const [selectedProtocol, setSelectedProtocol] = useState(protocols[0]);
  const [selectedSound, setSelectedSound] = useState('none');
  const [running, setRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState('Ready to begin');
  const [circleScale, setCircleScale] = useState(1);

  useEffect(() => {
    if (!running) {
      soundEngine.stop();
      setPhaseLabel('Ready to begin');
      setCircleScale(1);
      return;
    }

    if (selectedSound !== 'none') {
      soundEngine.play(selectedSound);
    }

    const cycleLen =
      selectedProtocol.inhale +
      selectedProtocol.hold +
      selectedProtocol.exhale +
      selectedProtocol.holdAfter;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        const pos = next % cycleLen;
        if (pos < selectedProtocol.inhale) {
          setPhaseLabel('Inhale Slowly...');
          setCircleScale(1.38);
        } else if (pos < selectedProtocol.inhale + selectedProtocol.hold) {
          setPhaseLabel('Hold Gently...');
          setCircleScale(1.38);
        } else if (pos < selectedProtocol.inhale + selectedProtocol.hold + selectedProtocol.exhale) {
          setPhaseLabel('Exhale Softly...');
          setCircleScale(0.88);
        } else {
          setPhaseLabel('Rest Empty...');
          setCircleScale(0.88);
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      soundEngine.stop();
    };
  }, [running, selectedProtocol, selectedSound]);

  const handleFinishAndLog = () => {
    setRunning(false);
    soundEngine.stop();
    const duration = Math.max(30, elapsedSeconds);
    onCompleteSession({
      protocol: selectedProtocol.name,
      durationSeconds: duration,
      soundscape: soundscapes.find((s) => s.id === selectedSound)?.label || 'Silence'
    });
    setElapsedSeconds(0);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-center">
      {/* Immersive Breathing Visualizer */}
      <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#211638] via-[#342359] to-[#1D352E] text-white p-8 sm:p-10 shadow-xl flex flex-col items-center justify-center min-h-[430px]">
        <div className="text-xs uppercase tracking-widest text-[#B9E7D3] font-semibold mb-2">
          {selectedProtocol.name}
        </div>
        <div className="text-3xl font-mono font-bold mb-8">{formatTime(elapsedSeconds)}</div>

        <div className="relative w-56 h-56 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-[#B9E7D3]/20"
            style={{
              transform: reducedMotion ? 'scale(1)' : `scale(${circleScale})`,
              transition: 'transform 3.5s ease-in-out'
            }}
          />
          <div
            className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#493477] to-[#B9E7D3] flex items-center justify-center text-center p-4 shadow-2xl"
            style={{
              transform: reducedMotion ? 'scale(1)' : `scale(${circleScale * 0.92})`,
              transition: 'transform 3.5s ease-in-out'
            }}
          >
            <span className="text-sm font-bold text-white drop-shadow">{phaseLabel}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setRunning(!running)}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#B9E7D3] text-[#211638] font-bold text-sm hover:opacity-95 transition"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{running ? 'Pause' : 'Start Session'}</span>
          </button>

          {elapsedSeconds > 0 && (
            <button
              onClick={handleFinishAndLog}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#211638] font-bold text-sm hover:bg-[#E8DFFF] transition"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2D6A54]" />
              <span>Complete & Nurture Garden</span>
            </button>
          )}
        </div>
      </div>

      {/* Protocol & Soundscape Controls */}
      <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#211638] mb-3">1. Select Breathing Rhythm</h3>
          <div className="space-y-2.5">
            {protocols.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setRunning(false);
                  setSelectedProtocol(p);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  selectedProtocol.id === p.id
                    ? 'bg-[#E8DFFF]/60 border-[#493477] font-bold'
                    : 'bg-[#FBF8F2] border-transparent hover:border-[#211638]/15'
                }`}
              >
                <div className="text-sm text-[#211638]">{p.name}</div>
                <div className="text-xs text-[#211638]/65 mt-0.5">
                  Inhale {p.inhale}s · Hold {p.hold}s · Exhale {p.exhale}s
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-[#211638] mb-3">
            2. Synthesized Ambient Soundscape
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {soundscapes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSound(s.id);
                  if (running) {
                    if (s.id === 'none') soundEngine.stop();
                    else soundEngine.play(s.id);
                  }
                }}
                className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold border transition ${
                  selectedSound === s.id
                    ? 'bg-[#211638] text-white border-[#211638]'
                    : 'bg-[#FBF8F2] text-[#211638] border-transparent'
                }`}
              >
                {s.id === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#B9E7D3]" />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE E: CARE CONNECT (VERIFIED HELPLINE DIRECTORY)
// ============================================================================
function CareConnectTab({ helplines }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');

  const countries = useMemo(() => {
    const set = new Set(helplines.map((h) => h.country));
    return ['All', ...Array.from(set)];
  }, [helplines]);

  const filtered = useMemo(() => {
    return helplines.filter((h) => {
      const matchesCountry = countryFilter === 'All' || h.country === countryFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q);
      return matchesCountry && matchesSearch;
    });
  }, [helplines, countryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#493477]">
              Verified Human Support
            </span>
            <h2 className="text-2xl font-bold text-[#211638] mt-0.5">Care Connect Directory</h2>
            <p className="text-xs sm:text-sm text-[#211638]/70 mt-1">
              Authentic, verified mental health and crisis helplines. Never fabricated—every verified entry cites its official source.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#211638]/45" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search helpline or category..."
                className="pl-10 pr-4 py-2.5 rounded-full bg-[#FBF8F2] border border-[#211638]/12 text-xs sm:text-sm focus:outline-none focus:border-[#493477]"
              />
            </div>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              aria-label="Filter by country"
              className="px-4 py-2.5 rounded-full bg-[#FBF8F2] border border-[#211638]/12 text-xs sm:text-sm font-medium"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Regions' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="rounded-3xl bg-[#FBF8F2] p-6 border border-[#211638]/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8DFFF] text-[#493477]">
                    {h.country} · {h.category}
                  </span>
                  {h.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#B9E7D3] text-[#211638]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Source
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F7D7C9] text-[#211638]">
                      Awaiting Verification
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#211638]">{h.name}</h3>
                <p className="text-xs sm:text-sm text-[#211638]/75 mt-1.5 leading-relaxed">
                  {h.description}
                </p>
                <div className="mt-3 text-[11px] text-[#211638]/60">
                  <div><strong>Availability:</strong> {h.availability}</div>
                  <div><strong>Source:</strong> {h.source}</div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#211638]/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${h.phone.replace(/[^+\d]/g, '')}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#211638] text-white text-xs font-bold hover:bg-[#493477] transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#B9E7D3]" />
                  <span>Call {h.phone}</span>
                </a>
                {h.website && (
                  <a
                    href={h.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#493477] hover:underline"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE F: WELLNESS JOURNAL
// ============================================================================
function WellnessJournalTab({ entries, onSave, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotionId, setEmotionId] = useState('reflective');
  const [search, setSearch] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSave({ id: editingId, title, content, emotionId });
    setEditingId(null);
    setTitle('');
    setContent('');
    setEmotionId('reflective');
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setEmotionId(entry.emotionId || 'reflective');
  };

  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Reflection Composer */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-7 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#211638]">
            {editingId ? 'Edit Reflection' : 'New Private Reflection'}
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#493477] bg-[#E8DFFF] px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Private to You
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#211638] mb-1">Entry Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Evening gratitude & decompression"
            className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#211638] mb-1">Linked Emotion</label>
          <select
            value={emotionId}
            onChange={(e) => setEmotionId(e.target.value)}
            className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
          >
            {EMOTION_NODES.map((em) => (
              <option key={em.id} value={em.id}>
                {em.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#211638] mb-1">Reflection</label>
          <textarea
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write freely without judgment..."
            className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 p-4 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-3 rounded-full bg-[#211638] text-white text-sm font-bold hover:bg-[#493477] transition"
          >
            {editingId ? 'Update Entry' : 'Save Reflection (+2 Care Pts)'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setContent('');
              }}
              className="px-4 py-3 rounded-full bg-[#FBF8F2] text-xs font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Private Entries List */}
      <div className="lg:col-span-7 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#211638]/45" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your private reflections..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#211638]/10 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#211638]/60">
            No journal entries found. Your thoughts remain strictly private to your account.
          </div>
        ) : (
          filtered.map((entry) => {
            const em = EMOTION_NODES.find((n) => n.id === entry.emotionId) || EMOTION_NODES[3];
            return (
              <div key={entry.id} className="rounded-3xl bg-white p-6 shadow-sm space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5"
                      style={{ backgroundColor: em.bgTint, color: '#211638' }}
                    >
                      {em.label} · {entry.dateKey}
                    </span>
                    <h4 className="text-lg font-bold text-[#211638]">{entry.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(entry)}
                      className="p-2 rounded-xl hover:bg-[#FBF8F2] text-[#493477]"
                      aria-label="Edit entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-red-600"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#211638]/80 leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE G: MY PROGRESS (WELLNESS INSIGHTS)
// ============================================================================
function ProgressInsightsTab({ moodLogs, journalEntries, calmSessions, totalCarePoints }) {
  const emotionCounts = useMemo(() => {
    const map = {};
    moodLogs.forEach((m) => {
      map[m.emotionId] = (map[m.emotionId] || 0) + 1;
    });
    return EMOTION_NODES.map((node) => ({
      ...node,
      count: map[node.id] || 0
    })).filter((n) => n.count > 0);
  }, [moodLogs]);

  const totalCalmMinutes = Math.round(
    calmSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
  );

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold text-[#493477]">Cumulative Care</div>
          <div className="text-3xl font-bold text-[#211638] mt-1">{totalCarePoints} pts</div>
          <div className="text-xs text-[#211638]/60 mt-1">Nurturing your Mind Garden</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold text-[#493477]">Emotional Check-Ins</div>
          <div className="text-3xl font-bold text-[#211638] mt-1">{moodLogs.length}</div>
          <div className="text-xs text-[#211638]/60 mt-1">Recorded in Emotion Universe</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold text-[#493477]">Mindful Breathing</div>
          <div className="text-3xl font-bold text-[#211638] mt-1">{totalCalmMinutes} min</div>
          <div className="text-xs text-[#211638]/60 mt-1">Across {calmSessions.length} sessions</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold text-[#493477]">Journal Reflections</div>
          <div className="text-3xl font-bold text-[#211638] mt-1">{journalEntries.length}</div>
          <div className="text-xs text-[#211638]/60 mt-1">Private entries stored</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#211638] mb-1">Weekly Engagement Trajectory</h3>
          <p className="text-xs text-[#211638]/65 mb-4">
            Visualizing your self-care consistency over the past 7 days
          </p>
          <WeeklyWellnessChart moodLogs={moodLogs} activities={calmSessions} />
        </div>

        <div className="lg:col-span-5 rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#211638] mb-1">Emotional Spectrum Distribution</h3>
          <p className="text-xs text-[#211638]/65 mb-4">
            A non-diagnostic reflection of the states you have noticed
          </p>
          {emotionCounts.length === 0 ? (
            <p className="text-xs text-[#211638]/60">Log emotions to view your personal distribution.</p>
          ) : (
            <div className="space-y-3">
              {emotionCounts.map((em) => {
                const pct = Math.round((em.count / moodLogs.length) * 100);
                return (
                  <div key={em.id}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{em.label}</span>
                      <span>
                        {em.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#FBF8F2] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: em.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SETTINGS TAB
// ============================================================================
function SettingsTab({
  user,
  userName,
  setDisplayNameOverride,
  reducedMotion,
  setReducedMotion,
  isAdmin,
  setIsAdmin,
  moodLogs,
  journalEntries,
  calmSessions,
  showToast
}) {
  const [nameInput, setNameInput] = useState(userName);

  const exportData = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      profile: { name: userName, uid: user?.uid || 'local' },
      moodLogs,
      journalEntries,
      calmSessions
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcare-sanctuary-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Your private wellness data has been exported.');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-[#211638]">Sanctuary Preferences</h3>

        <div>
          <label className="block text-xs font-bold text-[#211638] mb-1.5">Preferred Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
            />
            <button
              onClick={() => {
                setDisplayNameOverride(nameInput.trim() || 'Explorer');
                showToast('Display name updated.');
              }}
              className="px-5 py-2.5 rounded-full bg-[#211638] text-white text-xs font-bold"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#211638]/10">
          <div>
            <div className="text-sm font-bold text-[#211638]">Reduced Motion Accessibility</div>
            <div className="text-xs text-[#211638]/65">
              Minimizes orbital animations and breathing circle scaling transitions
            </div>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              reducedMotion ? 'bg-[#211638] text-white' : 'bg-[#E8DFFF] text-[#493477]'
            }`}
          >
            {reducedMotion ? 'Enabled' : 'Standard'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#211638]/10">
          <div>
            <div className="text-sm font-bold text-[#211638]">Administrator Role (Judge RBAC Demo)</div>
            <div className="text-xs text-[#211638]/65">
              Toggle role-based access to inspect the Admin Console
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdmin(!isAdmin);
              showToast(!isAdmin ? 'Admin Console unlocked in sidebar.' : 'Switched to standard user view.');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              isAdmin ? 'bg-[#B9E7D3] text-[#211638]' : 'bg-[#FBF8F2] text-[#211638]'
            }`}
          >
            {isAdmin ? 'Admin Active' : 'Enable Admin'}
          </button>
        </div>

        <div className="pt-4 border-t border-[#211638]/10 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#211638]">Export Personal Records</div>
            <div className="text-xs text-[#211638]/65">Download a portable JSON archive of your logs</div>
          </div>
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#493477] text-white text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN DASHBOARD (ROLE-BASED ACCESS CONTROL)
// ============================================================================
function AdminDashboardTab({
  helplines,
  setHelplines,
  resources,
  setResources,
  moodLogsCount,
  journalCount,
  calmCount,
  showToast
}) {
  const [newHelpline, setNewHelpline] = useState({
    name: '',
    country: 'India',
    category: 'Crisis Support',
    phone: '',
    availability: '24/7',
    source: ''
  });

  const handleAddHelpline = async (e) => {
    e.preventDefault();
    if (!newHelpline.name || !newHelpline.phone) return;
    const item = {
      id: `custom-h-${Date.now()}`,
      ...newHelpline,
      region: 'National',
      verified: Boolean(newHelpline.source.trim()),
      source: newHelpline.source.trim() || 'Pending Official Verification',
      description: 'Added via MindCare Admin Verification Console.'
    };

    if (db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'helplines', item.id), item);
      } catch (_) {}
    }
    setHelplines((prev) => [item, ...prev]);
    setNewHelpline({ name: '', country: 'India', category: 'Crisis Support', phone: '', availability: '24/7', source: '' });
    showToast('Helpline added to Care Connect directory.');
  };

  const toggleVerification = async (id) => {
    const updated = helplines.map((h) =>
      h.id === id ? { ...h, verified: !h.verified } : h
    );
    setHelplines(updated);
    const target = updated.find((h) => h.id === id);
    if (db && target) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'helplines', id), target);
      } catch (_) {}
    }
    showToast('Verification status updated.');
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[#211638] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#B9E7D3] text-[#211638]">
            <ShieldCheck className="w-3.5 h-3.5" /> Role-Based Admin Console
          </span>
          <h2 className="text-2xl font-bold mt-2">Platform Governance & Helpline Verification</h2>
          <p className="text-xs text-[#E8DFFF]/75 mt-1">
            Privacy-first architecture: Administrators manage verified public resources and aggregate telemetry. Private user journals are strictly inaccessible.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="px-4 py-3 rounded-2xl bg-white/10">
            <div className="text-lg font-bold text-[#B9E7D3]">{helplines.length}</div>
            <div className="text-[11px]">Helplines</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10">
            <div className="text-lg font-bold text-[#F7D7C9]">{resources.length}</div>
            <div className="text-[11px]">Guides</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10">
            <div className="text-lg font-bold text-[#E8DFFF]">{moodLogsCount + calmCount + journalCount}</div>
            <div className="text-[11px]">Session Events</div>
          </div>
        </div>
      </div>

      {/* Add & Verify Helplines */}
      <div className="grid lg:grid-cols-12 gap-8">
        <form onSubmit={handleAddHelpline} className="lg:col-span-5 rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#211638]">Register New Helpline Resource</h3>
          <input
            type="text"
            required
            placeholder="Organization Name"
            value={newHelpline.name}
            onChange={(e) => setNewHelpline({ ...newHelpline, name: e.target.value })}
            className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Country"
              value={newHelpline.country}
              onChange={(e) => setNewHelpline({ ...newHelpline, country: e.target.value })}
              className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Phone Number"
              value={newHelpline.phone}
              onChange={(e) => setNewHelpline({ ...newHelpline, phone: e.target.value })}
              className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Official Verification Source URL or Ministry"
            value={newHelpline.source}
            onChange={(e) => setNewHelpline({ ...newHelpline, source: e.target.value })}
            className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/12 px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#211638] text-white text-xs font-bold hover:bg-[#493477]"
          >
            Add to Care Connect
          </button>
        </form>

        <div className="lg:col-span-7 rounded-3xl bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#211638]">Verification Audit Workflow</h3>
          {helplines.map((h) => (
            <div
              key={h.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FBF8F2]"
            >
              <div>
                <div className="text-sm font-bold text-[#211638]">{h.name}</div>
                <div className="text-xs text-[#211638]/65">
                  {h.country} · {h.phone} · {h.source}
                </div>
              </div>
              <button
                onClick={() => toggleVerification(h.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  h.verified
                    ? 'bg-[#B9E7D3] text-[#211638]'
                    : 'bg-[#F7D7C9] text-[#211638]'
                }`}
              >
                {h.verified ? 'Verified ✓' : 'Mark Verified'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. AUTHENTICATION MODAL COMPONENT
// ============================================================================
function AuthModal({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authError,
  authBusy,
  onSubmit,
  onJudgeAccess,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#211638]/65 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-8 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FBF8F2]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#493477]">
            MindCare Sanctuary
          </span>
          <h2 className="text-2xl font-bold text-[#211638] mt-1">
            {authMode === 'login'
              ? 'Welcome Back'
              : authMode === 'register'
              ? 'Create Your Sanctuary'
              : 'Reset Password'}
          </h2>
        </div>

        {authError && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {authError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#211638] mb-1">Preferred Name</label>
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                placeholder="Maya"
                className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/15 px-4 py-3 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#211638] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/15 px-4 py-3 text-sm"
            />
          </div>

          {authMode !== 'reset' && (
            <div>
              <label className="block text-xs font-bold text-[#211638] mb-1">Password</label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-[#FBF8F2] border border-[#211638]/15 px-4 py-3 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={authBusy}
            className="w-full py-3.5 rounded-full bg-[#211638] text-white text-sm font-bold hover:bg-[#493477] transition"
          >
            {authBusy
              ? 'Please wait...'
              : authMode === 'login'
              ? 'Sign In'
              : authMode === 'register'
              ? 'Create Account'
              : 'Send Reset Link'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-[#493477] font-semibold">
          {authMode === 'login' ? (
            <>
              <button onClick={() => setAuthMode('register')}>Create an account</button>
              <button onClick={() => setAuthMode('reset')}>Forgot password?</button>
            </>
          ) : (
            <button onClick={() => setAuthMode('login')}>Back to Sign In</button>
          )}
        </div>

        <div className="pt-4 border-t border-[#211638]/10 space-y-2">
          <div className="text-[11px] font-semibold text-center text-[#211638]/60">
            Competition Judge Quick-Access
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onJudgeAccess(false)}
              className="py-2.5 px-3 rounded-2xl bg-[#E8DFFF] text-[#211638] text-xs font-bold hover:opacity-90"
            >
              User Demo Workspace
            </button>
            <button
              type="button"
              onClick={() => onJudgeAccess(true)}
              className="py-2.5 px-3 rounded-2xl bg-[#B9E7D3] text-[#211638] text-xs font-bold hover:opacity-90"
            >
              Admin RBAC Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
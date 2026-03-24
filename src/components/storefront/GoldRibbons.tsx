import { motion } from "framer-motion";

/**
 * Two diagonal gold ribbons overlaying the hero section,
 * matching the magazine layout. Pure SVG with metallic gradients.
 */
export function GoldRibbons() {
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        {/* Primary gold metallic gradient — along ribbon direction */}
        <linearGradient id="gold-ribbon-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="15%" stopColor="#C5A572" />
          <stop offset="30%" stopColor="#E8D5A3" />
          <stop offset="42%" stopColor="#F5ECD0" />
          <stop offset="50%" stopColor="#E8D5A3" />
          <stop offset="60%" stopColor="#C5A572" />
          <stop offset="75%" stopColor="#A8884A" />
          <stop offset="85%" stopColor="#D4B96E" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* Secondary ribbon — slightly different highlights for realism */}
        <linearGradient id="gold-ribbon-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8884A" />
          <stop offset="20%" stopColor="#D4B96E" />
          <stop offset="35%" stopColor="#F0E0B8" />
          <stop offset="50%" stopColor="#C5A572" />
          <stop offset="65%" stopColor="#E8D5A3" />
          <stop offset="80%" stopColor="#B89C5A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>

        {/* Edge highlight for 3D depth */}
        <linearGradient id="ribbon-edge-light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5ECD0" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#C5A572" stopOpacity="0" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3" />
        </linearGradient>

        {/* Shadow for depth */}
        <filter id="ribbon-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
        </filter>

        {/* Subtle inner shadow for volume */}
        <filter id="ribbon-inner-glow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset dx="0" dy="1" result="offsetBlur" />
          <feFlood floodColor="#F5ECD0" floodOpacity="0.15" result="color" />
          <feComposite in="color" in2="offsetBlur" operator="in" result="innerGlow" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerGlow" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── Ribbon 1: Top-left to bottom-right, main sweep ─── */}
      <g filter="url(#ribbon-shadow)">
        {/* Main ribbon body */}
        <polygon
          points="0,180 0,260 1440,620 1440,540"
          fill="url(#gold-ribbon-1)"
          filter="url(#ribbon-inner-glow)"
        />
        {/* Top edge highlight */}
        <polygon
          points="0,180 0,195 1440,555 1440,540"
          fill="url(#ribbon-edge-light)"
          opacity="0.7"
        />
        {/* Bottom edge shadow */}
        <polygon
          points="0,248 0,260 1440,620 1440,608"
          fill="#6B5210"
          opacity="0.4"
        />
      </g>

      {/* ─── Ribbon 2: Crossing from top-right to bottom-left ─── */}
      <g filter="url(#ribbon-shadow)">
        {/* Main ribbon body */}
        <polygon
          points="1440,140 1440,220 0,660 0,580"
          fill="url(#gold-ribbon-2)"
          filter="url(#ribbon-inner-glow)"
        />
        {/* Top edge highlight */}
        <polygon
          points="1440,140 1440,155 0,595 0,580"
          fill="url(#ribbon-edge-light)"
          opacity="0.7"
        />
        {/* Bottom edge shadow */}
        <polygon
          points="1440,208 1440,220 0,660 0,648"
          fill="#6B5210"
          opacity="0.4"
        />
      </g>
    </motion.svg>
  );
}

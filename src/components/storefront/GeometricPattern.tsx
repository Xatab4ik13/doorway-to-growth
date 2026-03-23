/**
 * SVG geometric pattern from Brandoors brandbook:
 * Grid of circles inscribed in squares, rendered as subtle dark-on-dark pattern.
 */
export function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="brandoors-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Square grid lines */}
          <rect x="0" y="0" width="120" height="120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          {/* Circle inscribed in each cell */}
          <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brandoors-grid)" />
    </svg>
  );
}

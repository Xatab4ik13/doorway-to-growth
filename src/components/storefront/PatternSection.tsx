/**
 * Empty section with Brandoors geometric pattern background.
 * Grid of circles inscribed in squares — exact match to brandbook.
 */
export function PatternSection() {
  return (
    <section className="relative w-full min-h-[600px] overflow-hidden" style={{ backgroundColor: "#0d0d11" }}>
      {/* SVG pattern background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="brandoors-circles-grid"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Square cell border */}
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            {/* Circle inscribed in the cell */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brandoors-circles-grid)" />
      </svg>

      {/* Year marker — bottom right */}
      <div className="absolute bottom-12 right-16 z-10">
        <span
          className="text-sm tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Raleway', sans-serif" }}
        >
          2026
        </span>
      </div>
    </section>
  );
}

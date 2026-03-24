/**
 * Empty section with Brandoors geometric pattern background.
 * Exact colors from brandbook: bg #07090d, lines #000000 (darker than bg).
 */
export function PatternSection() {
  return (
    <section className="relative w-full min-h-[600px] overflow-hidden" style={{ backgroundColor: "#07090d" }}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="brandoors-circles-grid"
            x="0"
            y="0"
            width="230"
            height="230"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="230"
              height="230"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle
              cx="115"
              cy="115"
              r="115"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brandoors-circles-grid)" />
      </svg>

      {/* Year marker — bottom right */}
      <div className="absolute bottom-12 right-16 z-10">
        <span
          className="text-sm tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Raleway', sans-serif" }}
        >
          2026
        </span>
      </div>
    </section>
  );
}

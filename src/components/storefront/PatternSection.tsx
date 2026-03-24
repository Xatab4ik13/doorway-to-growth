/**
 * Empty section with Brandoors geometric pattern background.
 * Exact match: dark navy-black bg, circles inscribed in squares, barely visible strokes.
 */
export function PatternSection() {
  return (
    <section className="relative w-full min-h-[600px] overflow-hidden" style={{ backgroundColor: "#0b0b13" }}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="brandoors-circles-grid"
            x="0"
            y="0"
            width="210"
            height="210"
            patternUnits="userSpaceOnUse"
          >
            {/* Square cell */}
            <rect
              x="0"
              y="0"
              width="210"
              height="210"
              fill="none"
              stroke="#1a1a24"
              strokeWidth="1"
            />
            {/* Circle inscribed in the cell */}
            <circle
              cx="105"
              cy="105"
              r="95"
              fill="none"
              stroke="#1a1a24"
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
          style={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Raleway', sans-serif" }}
        >
          2026
        </span>
      </div>
    </section>
  );
}

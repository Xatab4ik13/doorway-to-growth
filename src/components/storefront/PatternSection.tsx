/**
 * Empty section with Brandoors geometric pattern background.
 * Pattern: simple grid of squares, each with ONE inscribed circle.
 * No corner arcs. Exact colors: bg #07090d, lines #000000.
 */
export function PatternSection() {
  const cell = 230;
  const half = cell / 2;

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
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            {/* Square cell border */}
            <rect
              x="0" y="0"
              width={cell} height={cell}
              fill="none"
              stroke="#000000"
              strokeWidth={2}
            />
            {/* Single inscribed circle */}
            <circle
              cx={half} cy={half} r={half}
              fill="none"
              stroke="#000000"
              strokeWidth={2}
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

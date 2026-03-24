/**
 * Empty section with Brandoors geometric pattern background.
 * Reconstructed from the reference: 231px grid, one inscribed circle per cell,
 * with the exact pattern offset that creates the asymmetric composition.
 */
export function PatternSection() {
  const cell = 231;
  const half = cell / 2;

  return (
    <section className="relative w-full min-h-[600px] overflow-hidden" style={{ backgroundColor: "#07090d" }}>
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="brandoors-circles-grid"
            x={-117}
            y={-50}
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width={cell}
              height={cell}
              fill="none"
              stroke="#000000"
              strokeWidth={2}
            />
            <circle
              cx={half}
              cy={half}
              r={half}
              fill="none"
              stroke="#000000"
              strokeWidth={2}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brandoors-circles-grid)" />
      </svg>

      <div className="absolute bottom-[112px] right-[156px] z-10">
        <span
          className="text-[16px] tracking-[0.04em] text-white"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          2026
        </span>
      </div>
    </section>
  );
}

import patternBg from "@/assets/pattern-background.svg";

export function PatternSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#07090d" }}
    >
      <img
        src={patternBg}
        alt=""
        className="w-full h-auto block"
        draggable={false}
      />
      <div className="absolute bottom-8 right-10 z-10">
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

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
    </section>
  );
}

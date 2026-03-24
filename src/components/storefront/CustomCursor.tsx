import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 700 });

  const [variant, setVariant] = useState<"default" | "hover" | "prev" | "next">("default");
  const rafRef = useRef<number>();

  const onMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    });
  }, [cursorX, cursorY]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onMove]);

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorAttr === "prev") return setVariant("prev");
      if (cursorAttr === "next") return setVariant("next");

      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='hover']");
      if (interactive) return setVariant("hover");
      setVariant("default");
    };

    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  const size =
    variant === "default" ? 10 :
    variant === "hover" ? 40 :
    36; // prev/next

  const showArrow = variant === "prev" || variant === "next";

  return (
    <>
      {/* Hide default cursor on storefront */}
      <style>{`
        .storefront-cursor, .storefront-cursor * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: size,
            height: size,
            backgroundColor:
              variant === "default"
                ? "rgba(197,165,114,1)"
                : "rgba(197,165,114,0.15)",
            borderWidth: variant === "default" ? 0 : 1,
            borderColor: "rgba(197,165,114,0.5)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ borderStyle: "solid" }}
        >
          {showArrow && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-light select-none"
              style={{ color: "rgba(197,165,114,0.9)", fontFamily: "'Raleway', sans-serif" }}
            >
              {variant === "prev" ? "←" : "→"}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

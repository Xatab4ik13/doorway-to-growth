import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const topRightLines = Array.from({ length: 10 }, (_, index) => index);
const bottomRightLines = Array.from({ length: 9 }, (_, index) => index);

export function HeroSection({ site }: Props) {
  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg"
      aria-label="Hero секция BRANDOORS"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 53% 42%, hsla(220, 17%, 14%, 0.92) 0%, hsla(220, 15%, 10%, 0.78) 24%, hsla(0, 0%, 3%, 0.98) 58%, hsla(0, 0%, 1%, 1) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsla(0, 0%, 1%, 1) 0%, hsla(0, 0%, 1%, 0.98) 34%, hsla(221, 18%, 8%, 0.94) 58%, hsla(219, 16%, 11%, 0.98) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsla(0, 0%, 1%, 0.78) 0%, hsla(0, 0%, 1%, 0.28) 28%, transparent 42%, transparent 100%)",
          }}
        />

        <motion.div
          className="absolute -right-[16%] -top-[24%] h-[88%] w-[68%]"
          initial={{ opacity: 0, x: 50, y: -50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
          style={{ transform: "rotate(45deg)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsla(0, 0%, 2%, 0.98) 0%, hsla(220, 14%, 7%, 0.98) 34%, hsla(218, 12%, 16%, 0.88) 58%, hsla(0, 0%, 3%, 0.98) 100%)",
              boxShadow:
                "0 0 0 1px hsla(41, 34%, 48%, 0.18), inset 0 0 120px hsla(0, 0%, 0%, 0.58), inset 0 0 32px hsla(0, 0%, 100%, 0.03)",
            }}
          />
          <div
            className="absolute inset-[2.3%]"
            style={{
              background:
                "linear-gradient(135deg, hsla(221, 18%, 7%, 0.98) 0%, hsla(217, 18%, 12%, 0.96) 52%, hsla(222, 14%, 7%, 0.99) 100%)",
              boxShadow: "inset 0 0 80px hsla(0, 0%, 0%, 0.46)",
            }}
          />
          <div
            className="absolute inset-[8%]"
            style={{
              background:
                "radial-gradient(circle at 51% 42%, hsla(0, 0%, 100%, 0.055) 0%, hsla(43, 34%, 66%, 0.045) 13%, hsla(216, 13%, 11%, 0.08) 24%, transparent 56%)",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute -right-[1%] top-[-2%] z-[3] h-[38%] w-[43%]"
          initial={{ opacity: 0, x: 36, y: -36 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.28 }}
        >
          {topRightLines.map((line) => {
            const shift = line * 4.2;
            return (
              <div
                key={`top-line-${line}`}
                className="absolute origin-top-right"
                style={{
                  right: `${shift}%`,
                  top: `${-6 + line * 0.35}%`,
                  width: "142%",
                  height: line === 0 ? "3px" : line === 1 ? "2px" : "1.5px",
                  transform: "rotate(45deg)",
                  background:
                    "linear-gradient(90deg, hsla(43, 40%, 82%, 0.96) 0%, hsla(41, 39%, 66%, 0.94) 46%, hsla(39, 30%, 48%, 0.72) 100%)",
                  boxShadow: line < 2 ? "0 0 12px hsla(43, 50%, 76%, 0.12)" : "none",
                  opacity: 1 - line * 0.06,
                }}
              />
            );
          })}
        </motion.div>

        <motion.div
          className="absolute -right-[10%] bottom-[-18%] z-[4] h-[50%] w-[70%]"
          initial={{ opacity: 0, x: 44, y: 44 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.22 }}
        >
          <div
            className="absolute left-[2%] top-[26%] h-[12%] w-[78%]"
            style={{
              transform: "rotate(-45deg)",
              background:
                "linear-gradient(180deg, hsla(0, 0%, 3%, 0.98) 0%, hsla(220, 14%, 10%, 0.99) 18%, hsla(43, 33%, 77%, 0.99) 49%, hsla(40, 35%, 54%, 0.96) 70%, hsla(0, 0%, 6%, 0.99) 100%)",
              boxShadow:
                "0 0 0 1px hsla(42, 34%, 48%, 0.2), 0 26px 80px hsla(0, 0%, 0%, 0.58), inset 0 0 18px hsla(0, 0%, 100%, 0.08)",
            }}
          />

          <div
            className="absolute left-[30%] top-[27%] h-[6%] w-[18%]"
            style={{
              transform: "rotate(-45deg)",
              background:
                "radial-gradient(circle at 50% 50%, hsla(45, 61%, 90%, 0.42) 0%, hsla(44, 48%, 75%, 0.16) 35%, transparent 70%)",
              filter: "blur(3px)",
            }}
          />

          {bottomRightLines.map((line) => {
            const shift = line * 4.6;
            return (
              <div
                key={`bottom-line-${line}`}
                className="absolute origin-bottom-right"
                style={{
                  right: `${1 + shift}%`,
                  bottom: `${5 + line * 1.8}%`,
                  width: "92%",
                  height: line === 0 ? "2px" : "1.5px",
                  transform: "rotate(-45deg)",
                  background:
                    "linear-gradient(90deg, hsla(43, 42%, 76%, 0.96) 0%, hsla(41, 39%, 60%, 0.9) 52%, hsla(39, 31%, 42%, 0.68) 100%)",
                  boxShadow: line < 2 ? "0 0 10px hsla(43, 50%, 72%, 0.1)" : "none",
                  opacity: 0.96 - line * 0.068,
                }}
              />
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:px-16">
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "hsla(0, 0%, 100%, 0.22)" }}
          >
            {site?.name || "BRANDOORS"}
          </span>
          <span
            className="text-xs tracking-[0.2em]"
            style={{ color: "hsla(0, 0%, 100%, 0.15)" }}
          >
            {site?.phone || "+7 (495) 137 77 87"}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

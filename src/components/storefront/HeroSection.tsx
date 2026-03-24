import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const topRightLines = Array.from({ length: 11 }, (_, index) => index);
const bottomRightLines = Array.from({ length: 9 }, (_, index) => index);

export function HeroSection({ site }: Props) {
  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg"
      aria-label="Hero секция BRANDOORS"
    >
      <motion.div
        className="absolute inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 52% 44%, hsla(215, 16%, 16%, 0.9) 0%, hsla(225, 18%, 8%, 0.82) 28%, hsla(0, 0%, 2%, 0.98) 62%, hsla(0, 0%, 1%, 1) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsla(0, 0%, 1%, 1) 0%, hsla(0, 0%, 1%, 1) 32%, hsla(225, 18%, 8%, 0.94) 54%, hsla(220, 18%, 12%, 0.98) 100%)",
          }}
        />

        <motion.div
          className="absolute -right-[18%] -top-[28%] h-[92%] w-[72%]"
          initial={{ opacity: 0, x: 60, y: -60 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          style={{ transform: "rotate(45deg)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsla(0, 0%, 2%, 0.96) 0%, hsla(220, 14%, 8%, 0.98) 38%, hsla(215, 12%, 15%, 0.92) 58%, hsla(0, 0%, 3%, 0.98) 100%)",
              boxShadow:
                "0 0 0 1px hsla(41, 38%, 54%, 0.18), inset 0 0 100px hsla(0, 0%, 0%, 0.65), inset 0 0 30px hsla(0, 0%, 100%, 0.03)",
            }}
          />
          <div
            className="absolute inset-[2.2%]"
            style={{
              background:
                "linear-gradient(135deg, hsla(222, 18%, 7%, 0.98) 0%, hsla(215, 18%, 12%, 0.95) 52%, hsla(221, 14%, 7%, 0.98) 100%)",
              boxShadow: "inset 0 0 80px hsla(0, 0%, 0%, 0.5)",
            }}
          />
          <div
            className="absolute inset-[8%]"
            style={{
              background:
                "radial-gradient(circle at 52% 44%, hsla(0, 0%, 100%, 0.06) 0%, hsla(42, 34%, 62%, 0.05) 12%, hsla(216, 14%, 12%, 0.12) 25%, transparent 55%)",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute -right-[2%] top-0 z-[3] h-[42%] w-[46%]"
          initial={{ opacity: 0, x: 40, y: -40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        >
          {topRightLines.map((line) => {
            const offset = line * 4.1;
            return (
              <div
                key={`top-line-${line}`}
                className="absolute origin-top-right"
                style={{
                  right: `${offset}%`,
                  top: `${-12 + line * 0.6}%`,
                  width: "140%",
                  height: line === 0 ? "3px" : line === 1 ? "2px" : "1.5px",
                  transform: "rotate(45deg)",
                  background:
                    "linear-gradient(90deg, hsla(42, 39%, 76%, 0.96) 0%, hsla(41, 38%, 62%, 0.92) 45%, hsla(38, 33%, 46%, 0.75) 100%)",
                  boxShadow: line < 3 ? "0 0 16px hsla(42, 48%, 70%, 0.18)" : "none",
                  opacity: 1 - line * 0.055,
                }}
              />
            );
          })}
        </motion.div>

        <motion.div
          className="absolute -right-[12%] bottom-[-24%] z-[4] h-[54%] w-[66%]"
          initial={{ opacity: 0, x: 60, y: 60 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.25 }}
        >
          <div
            className="absolute left-[16%] top-[11%] h-[16%] w-[66%] origin-center"
            style={{
              transform: "rotate(-45deg)",
              background:
                "linear-gradient(180deg, hsla(0, 0%, 5%, 0.98) 0%, hsla(220, 14%, 10%, 0.98) 18%, hsla(43, 34%, 74%, 0.98) 50%, hsla(40, 36%, 52%, 0.95) 70%, hsla(0, 0%, 7%, 0.98) 100%)",
              boxShadow:
                "0 0 0 1px hsla(42, 36%, 46%, 0.18), 0 30px 80px hsla(0, 0%, 0%, 0.55), inset 0 0 20px hsla(0, 0%, 100%, 0.08)",
            }}
          />

          <div
            className="absolute left-[25%] top-[20%] h-[8%] w-[45%] origin-center"
            style={{
              transform: "rotate(-45deg)",
              background:
                "radial-gradient(circle at 50% 50%, hsla(44, 49%, 88%, 0.48) 0%, hsla(43, 40%, 68%, 0.22) 20%, transparent 54%)",
              filter: "blur(3px)",
            }}
          />

          {bottomRightLines.map((line) => {
            const offset = line * 4.5;
            return (
              <div
                key={`bottom-line-${line}`}
                className="absolute origin-bottom-right"
                style={{
                  right: `${-1 + offset}%`,
                  bottom: `${2 + line * 1.7}%`,
                  width: "92%",
                  height: line === 0 ? "2px" : "1.5px",
                  transform: "rotate(-45deg)",
                  background:
                    "linear-gradient(90deg, hsla(43, 42%, 72%, 0.94) 0%, hsla(41, 38%, 58%, 0.88) 52%, hsla(38, 34%, 42%, 0.7) 100%)",
                  boxShadow: line < 2 ? "0 0 12px hsla(43, 48%, 70%, 0.14)" : "none",
                  opacity: 0.96 - line * 0.065,
                }}
              />
            );
          })}
        </motion.div>

        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, hsla(0, 0%, 1%, 0.72) 0%, hsla(0, 0%, 1%, 0.36) 25%, transparent 42%, transparent 100%)",
          }}
        />
      </motion.div>

      <div className="absolute inset-0 z-10 flex items-center">
        <motion.div
          className="w-full px-8 sm:px-12 lg:px-24"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.55 }}
        >
          <div className="max-w-[620px]">
            <motion.img
              src={brandoorsLogo}
              alt="BRANDOORS"
              className="h-auto w-[300px] sm:w-[430px] lg:w-[560px]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.72 }}
            />

            <motion.p
              className="mt-2 pl-[130px] text-[17px] font-medium text-white/95 sm:mt-3 sm:pl-[185px] sm:text-[24px] lg:pl-[206px] lg:text-[27px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.92 }}
            >
              Входные и межкомнатные двери
            </motion.p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1 }}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:px-16">
          <span className="text-xs uppercase tracking-[0.3em] text-white/22">
            {site?.name || "BRANDOORS"}
          </span>
          <span className="text-xs tracking-[0.2em] text-white/15">
            {site?.phone || "+7 (495) 137 77 87"}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

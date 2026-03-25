import { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { CartButton } from "./CartButton";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_ITEMS = [
  { label: "Каталог", href: "catalog", isRoute: true },
  { label: "Отзывы", href: "#about", isRoute: false },
  { label: "О салоне", href: "#about", isRoute: false },
  { label: "Контакты", href: "#contacts", isRoute: false },
];

export function HeroSection({ site, banners }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">

      {/* Dark gradient background (placeholder until banners are added) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 70% 40%, rgba(207,187,150,0.06) 0%, transparent 60%), linear-gradient(135deg, #0a0c10 0%, #07090d 50%, #0d0f14 100%)",
        }}
      />

      {/* Phone + Cart — right side, desktop */}
      <div className="absolute top-0 right-0 z-40 hidden lg:flex items-center gap-4 h-[56px] pr-10 xl:pr-14">
        {site.phone && (
          <a
            href={`tel:${site.phone}`}
            className="flex items-center gap-2.5 font-medium transition-colors duration-300"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "15px",
              color: "#cfbb96",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z" />
            </svg>
            {site.phone}
          </a>
        )}
        <CartButton />
      </div>

      {/* === GOLD L-SHAPE: sidebar + nav tab === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:block"
        style={{ width: "820px" }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH, delay: 0.1 }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 820 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sidebarGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfbb96" />
              <stop offset="10%" stopColor="#c2b08c" />
              <stop offset="25%" stopColor="#b2a07c" />
              <stop offset="40%" stopColor="#a59370" />
              <stop offset="55%" stopColor="#9a8a69" />
              <stop offset="70%" stopColor="#887555" />
              <stop offset="85%" stopColor="#78674b" />
              <stop offset="100%" stopColor="#6e5f40" />
            </linearGradient>
          </defs>
          <path
            d={`
              M 0 0
              L 780 0
              L 780 16
              Q 780 56, 740 56
              L 308 56
              Q 260 56, 260 104
              L 260 852
              Q 260 900, 212 900
              L 0 900
              Z
            `}
            fill="url(#sidebarGold)"
          />
        </svg>

        {/* Nav links in top tab */}
        <div className="absolute top-0 left-[280px] h-[56px] flex items-center gap-8 xl:gap-10">
          {NAV_ITEMS.map((item) =>
            item.isRoute ? (
              <Link
                key={item.label}
                to={`/store/${site.slug}/${item.href}`}
                className="text-[14px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300"
                style={{ fontFamily: "'Raleway', sans-serif", color: "rgba(26,20,8,0.6)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.95)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.6)"; }}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-[14px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300"
                style={{ fontFamily: "'Raleway', sans-serif", color: "rgba(26,20,8,0.6)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.95)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.6)"; }}
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Logo rotated */}
        <div className="absolute left-0 w-[260px] top-1/2 -translate-y-1/2 flex items-center justify-center">
          <img
            src={brandoorsLogo}
            alt="Brandoors"
            style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "82px" }}
          />
        </div>

        {/* Social links */}
        <div className="absolute left-0 w-[260px] bottom-10 flex flex-col items-center gap-3">
          {[
            { href: "https://vk.com", icon: "M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z" },
            { href: "https://t.me", icon: "M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(26,20,8,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
      </motion.div>

      {/* === SCROLL HINT === */}
      <motion.div
        className="absolute bottom-24 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/20"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* === BOTTOM FADE === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #07090d 100%)" }}
      />
    </section>
  );
}

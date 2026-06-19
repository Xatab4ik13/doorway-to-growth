import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import brandoorsLogo from "@/assets/logo.png";
import { storeHref } from "@/lib/storeHref";

interface Props {
  site: StorefrontSite;
}

export function StorefrontFooter({ site }: Props) {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#07090D" }}>
      {/* Top gold line */}
      <div
        className="h-px"
        style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.2) 30%, rgba(207,187,150,0.35) 50%, rgba(207,187,150,0.2) 70%, transparent 95%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div>
            <img
              src={brandoorsLogo}
              alt="Brandoors"
              className="h-8 mb-5"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
            />
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(245,245,240,0.4)", fontFamily: "'Raleway', sans-serif" }}
            >
              Межкомнатные и входные двери премиум-класса. Официальный салон в {site.district || site.city}.
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-5"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}
            >
              Контакты
            </h4>
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif" }}
              >
                <Phone className="w-4 h-4 shrink-0" style={{ color: "rgba(207,187,150,0.5)" }} />
                {site.phone}
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif" }}
              >
                <Mail className="w-4 h-4 shrink-0" style={{ color: "rgba(207,187,150,0.5)" }} />
                {site.email}
              </a>
            )}
            {site.address && (
              <div
                className="flex items-start gap-3 text-sm"
                style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif" }}
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "rgba(207,187,150,0.5)" }} />
                <span>{site.city}, {site.address}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-5"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}
            >
              Навигация
            </h4>
            {[
              { label: "Каталог", href: storeHref(site.slug, "catalog"), isRoute: true },
              { label: "Отзывы", href: "#about", isRoute: false },
              { label: "О салоне", href: "#about", isRoute: false },
              { label: "Контакты", href: "#contacts", isRoute: false },
            ].map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-14 pt-6 text-center text-xs"
          style={{
            borderTop: "1px solid rgba(207,187,150,0.08)",
            color: "rgba(245,245,240,0.2)",
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          © {new Date().getFullYear()} BRANDOORS. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

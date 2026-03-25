import { useState } from "react";
import { Link } from "react-router-dom";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { Phone, Menu, X } from "lucide-react";
import { CartButton } from "./CartButton";

interface Props {
  site: StorefrontSite;
}

const NAV_ITEMS = [
  { label: "Каталог", href: "catalog", isRoute: true },
  { label: "Акции", href: "#promotions", isRoute: false },
  { label: "О салоне", href: "#about", isRoute: false },
  { label: "Контакты", href: "#contacts", isRoute: false },
];

export function StorefrontHeader({ site }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-storefront-bg/95 backdrop-blur-md border-b border-white/5">
        <div className="px-5 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-wider text-storefront-text">
            BRANDOORS
          </span>
          <div className="flex items-center gap-2">
            <CartButton />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-storefront-text">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="bg-storefront-bg border-t border-white/5 px-5 py-4 space-y-1">
            {NAV_ITEMS.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.href}
                  to={`/store/${site.slug}/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm uppercase tracking-widest text-storefront-muted hover:text-storefront-gold transition-colors py-2.5"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm uppercase tracking-widest text-storefront-muted hover:text-storefront-gold transition-colors py-2.5"
                >
                  {item.label}
                </a>
              )
            )}
            {site.phone && (
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-sm text-storefront-gold pt-3 border-t border-white/5 mt-2">
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
            )}
          </div>
        )}
      </header>
    </>
  );
}

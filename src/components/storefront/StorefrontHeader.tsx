import { useState } from "react";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { Phone, Menu, X } from "lucide-react";

interface Props {
  site: StorefrontSite;
}

const NAV_ITEMS = [
  { label: "Каталог", href: "#catalog" },
  { label: "Акции", href: "#promotions" },
  { label: "О салоне", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

export function StorefrontHeader({ site }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-storefront-bg/90 backdrop-blur-md border-b border-storefront-gold/10">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wider text-storefront-text">
            BR<span className="inline-flex items-center justify-center w-6 h-6 border border-storefront-gold text-storefront-gold text-xs font-bold mx-[1px]">A-</span>NDOORS
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-storefront-muted hover:text-storefront-gold transition-colors uppercase"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Phone + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {site.phone && (
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-sm text-storefront-muted hover:text-storefront-gold transition-colors">
              <Phone className="w-4 h-4" />
              <span>{site.phone}</span>
            </a>
          )}
          <a
            href="#contacts"
            className="px-5 py-2 text-sm font-medium bg-storefront-gold text-storefront-bg hover:bg-storefront-gold-light transition-colors uppercase tracking-wider"
          >
            Записаться
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-storefront-text"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-storefront-bg border-t border-storefront-gold/10 px-6 py-4 space-y-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm uppercase tracking-wide text-storefront-muted hover:text-storefront-gold transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
          {site.phone && (
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-sm text-storefront-gold py-2">
              <Phone className="w-4 h-4" />
              {site.phone}
            </a>
          )}
        </div>
      )}
    </header>
  );
}

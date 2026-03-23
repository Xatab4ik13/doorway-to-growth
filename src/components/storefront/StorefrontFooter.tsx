import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { Phone, Mail, MapPin } from "lucide-react";

interface Props {
  site: StorefrontSite;
}

export function StorefrontFooter({ site }: Props) {
  return (
    <footer className="bg-storefront-bg border-t border-storefront-gold/10 py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold tracking-wider text-storefront-text">
              BR<span className="inline-flex items-center justify-center w-6 h-6 border border-storefront-gold text-storefront-gold text-xs font-bold mx-[1px]">A-</span>NDOORS
            </span>
            <p className="mt-3 text-sm text-storefront-muted leading-relaxed">
              Межкомнатные двери премиум-класса
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-storefront-gold">Контакты</h4>
            {site.phone && (
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-sm text-storefront-muted hover:text-storefront-text transition-colors">
                <Phone className="w-4 h-4 text-storefront-gold/60" />
                {site.phone}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm text-storefront-muted hover:text-storefront-text transition-colors">
                <Mail className="w-4 h-4 text-storefront-gold/60" />
                {site.email}
              </a>
            )}
            {site.address && (
              <div className="flex items-start gap-2 text-sm text-storefront-muted">
                <MapPin className="w-4 h-4 text-storefront-gold/60 mt-0.5 shrink-0" />
                <span>{site.city}, {site.address}</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-storefront-gold">Навигация</h4>
            {["Каталог", "Акции", "О салоне", "Контакты"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="block text-sm text-storefront-muted hover:text-storefront-text transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-storefront-gold/10 text-center text-xs text-storefront-muted/50">
          © {new Date().getFullYear()} BRANDOORS. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

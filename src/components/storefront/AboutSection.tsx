import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { GeometricPattern } from "./GeometricPattern";
import { MapPin, Clock, Shield } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  position: string | null;
  photo_url: string | null;
}

interface Props {
  site: StorefrontSite;
  staff: StaffMember[];
}

export function AboutSection({ site, staff }: Props) {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Darker background with pattern */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <GeometricPattern className="opacity-50" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-[1px] bg-storefront-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-storefront-gold">О салоне</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-storefront-text mb-12">
          О нашем <span className="text-storefront-gold">салоне</span>
        </h2>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: MapPin, title: "Удобное расположение", desc: site.address ? `${site.city}, ${site.address}` : `${site.city}${site.district ? `, ${site.district}` : ""}` },
            { icon: Clock, title: "Ежедневно", desc: "Работаем 7 дней в неделю для вашего удобства" },
            { icon: Shield, title: "Гарантия качества", desc: "Официальный дилер BRANDOORS с полной гарантией" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="w-12 h-12 border border-storefront-gold/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-storefront-gold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-storefront-text uppercase tracking-wide">{title}</h3>
                <p className="mt-1 text-sm text-storefront-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Staff */}
        {staff.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-storefront-text mb-6">Наша команда</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {staff.map((member) => (
                <div key={member.id} className="bg-storefront-card p-4">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full aspect-square object-cover mb-3 grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full aspect-square bg-storefront-bg flex items-center justify-center mb-3">
                      <span className="text-3xl text-storefront-muted/30 font-bold">{member.name[0]}</span>
                    </div>
                  )}
                  <h4 className="text-sm font-medium text-storefront-text">{member.name}</h4>
                  {member.position && <p className="text-xs text-storefront-muted mt-0.5">{member.position}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

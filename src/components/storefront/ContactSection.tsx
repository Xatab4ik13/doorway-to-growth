import { useState } from "react";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  site: StorefrontSite;
}

export function ContactSection({ site }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSending(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name,
        phone: form.phone,
        message: form.message || null,
        site_id: site.id,
        source: "website",
      });
      if (error) throw error;
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время" });
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacts" className="py-20 bg-storefront-bg">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-[1px] bg-storefront-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-storefront-gold">Контакты</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-storefront-text mb-12">
          Свяжитесь <span className="text-storefront-gold">с нами</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {site.address && (
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-storefront-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-storefront-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-storefront-text">Адрес</h4>
                  <p className="text-sm text-storefront-muted mt-1">{site.city}, {site.address}</p>
                </div>
              </div>
            )}
            {site.phone && (
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-storefront-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-storefront-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-storefront-text">Телефон</h4>
                  <a href={`tel:${site.phone}`} className="text-sm text-storefront-muted mt-1 hover:text-storefront-gold transition-colors">{site.phone}</a>
                </div>
              </div>
            )}
            {site.email && (
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-storefront-gold/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-storefront-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-storefront-text">Email</h4>
                  <a href={`mailto:${site.email}`} className="text-sm text-storefront-muted mt-1 hover:text-storefront-gold transition-colors">{site.email}</a>
                </div>
              </div>
            )}
          </div>

          {/* Lead form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-storefront-card p-8">
            <h3 className="text-lg font-semibold text-storefront-text mb-2">Оставить заявку</h3>
            <p className="text-sm text-storefront-muted mb-6">Заполните форму и мы свяжемся с вами</p>
            <input
              type="text"
              placeholder="Ваше имя *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-storefront-bg border border-storefront-gold/10 text-storefront-text text-sm placeholder:text-storefront-muted/50 focus:border-storefront-gold/40 focus:outline-none transition-colors"
            />
            <input
              type="tel"
              placeholder="Телефон *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full px-4 py-3 bg-storefront-bg border border-storefront-gold/10 text-storefront-text text-sm placeholder:text-storefront-muted/50 focus:border-storefront-gold/40 focus:outline-none transition-colors"
            />
            <textarea
              placeholder="Сообщение"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-storefront-bg border border-storefront-gold/10 text-storefront-text text-sm placeholder:text-storefront-muted/50 focus:border-storefront-gold/40 focus:outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 bg-storefront-gold text-storefront-bg font-medium uppercase tracking-wider text-sm hover:bg-storefront-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

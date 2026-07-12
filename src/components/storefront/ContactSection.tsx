import { useState } from "react";
import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  site: StorefrontSite;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ContactSection({ site }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    {
      icon: MapPin,
      label: "Адрес",
      value: site.address ? `${site.city}, ${site.address}` : site.city,
    },
    {
      icon: Phone,
      label: "Телефон",
      value: site.phone,
      href: site.phone ? `tel:${site.phone}` : undefined,
    },
    {
      icon: Mail,
      label: "Почта",
      value: site.email,
      href: site.email ? `mailto:${site.email}` : undefined,
    },
  ].filter((c) => c.value);

  return (
    <section
      id="contacts"
      className="relative w-full overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: "#07090D" }}
    >
      {/* Subtle top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 30%, rgba(207,187,150,0.25) 50%, rgba(207,187,150,0.15) 70%, transparent 95%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
          >
            Свяжитесь <span style={{ color: "#cfbb96" }}>с нами</span>
          </h2>
          <p
            className="max-w-lg text-sm md:text-base leading-relaxed"
            style={{ color: "rgba(245,245,240,0.45)", fontFamily: "'Onest', sans-serif" }}
          >
            Оставьте заявку или свяжитесь с нами напрямую — мы ответим в ближайшее время
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* Left — contact cards */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            {contacts.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-md border border-white/[0.06] cursor-default"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(30,30,30,0.4) 100%)",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {/* Hover glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#cfbb96]/0 group-hover:bg-[#cfbb96]/10 blur-2xl transition-all duration-500" />

                <div className="relative z-10 flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(207,187,150,0.10)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#cfbb96" }} />
                  </div>
                  <div>
                    <span
                      className="text-[11px] uppercase tracking-[0.25em] mb-1.5 block"
                      style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Onest', sans-serif" }}
                    >
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-[15px] font-medium hover:opacity-80 transition-opacity"
                        style={{ color: "#F5F5F0", fontFamily: "'Onest', sans-serif" }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] font-medium" style={{ color: "#F5F5F0" }}>
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Working hours mini-card */}
            <motion.div
              className="rounded-2xl p-6 border border-white/[0.06]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(207,187,150,0.04) 0%, rgba(20,20,20,0.3) 100%)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Onest', sans-serif" }}
                >
                  Сейчас открыто
                </span>
              </div>
              <p className="text-sm font-medium whitespace-pre-line" style={{ color: "#F5F5F0" }}>
                Пн-Пт 9:00 — 18:00{"\n"}Сб 9:00 — 13:00{"\n"}Вс — выходной
              </p>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <div
              className="relative overflow-hidden rounded-3xl p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(175deg, rgba(207,187,150,0.08) 0%, rgba(15,15,15,0.6) 50%, rgba(207,187,150,0.03) 100%)",
                border: "1px solid rgba(207,187,150,0.12)",
              }}
            >
              {/* Decorative corner accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(207,187,150,0.08) 0%, transparent 70%)",
                }}
              />

              {sent ? (
                <motion.div
                  className="flex flex-col items-center text-center py-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-16 h-16 mb-6" style={{ color: "#cfbb96" }} />
                  </motion.div>
                  <h3
                    className="text-2xl font-light tracking-[0.15em] uppercase mb-3"
                    style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
                  >
                    Заявка отправлена
                  </h3>
                  <p
                    className="text-sm max-w-xs"
                    style={{ color: "rgba(245,245,240,0.5)" }}
                  >
                    Мы свяжемся с вами в ближайшее время
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-300"
                    style={{ color: "rgba(207,187,150,0.7)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#cfbb96";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(207,187,150,0.7)";
                    }}
                  >
                    Отправить ещё
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3
                    className="text-xl font-light tracking-[0.15em] uppercase mb-2"
                    style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
                  >
                    Оставить заявку
                  </h3>
                  <p
                    className="text-sm mb-8"
                    style={{ color: "rgba(245,245,240,0.4)", fontFamily: "'Onest', sans-serif" }}
                  >
                    Заполните форму и мы перезвоним
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                      { key: "name", placeholder: "Ваше имя", type: "text", required: true },
                      { key: "phone", placeholder: "Телефон", type: "tel", required: true },
                    ].map(({ key, placeholder, type, required }) => (
                      <div key={key} className="relative group">
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          required={required}
                          className="w-full px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(207,187,150,0.1)",
                            color: "#F5F5F0",
                            fontFamily: "'Onest', sans-serif",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "rgba(207,187,150,0.35)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(207,187,150,0.1)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                          }}
                        />
                      </div>
                    ))}

                    <div className="relative">
                      <textarea
                        placeholder="Сообщение (необязательно)"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={3}
                        className="w-full px-5 py-4 rounded-xl text-sm font-medium resize-none transition-all duration-300 focus:outline-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(207,187,150,0.1)",
                          color: "#F5F5F0",
                          fontFamily: "'Onest', sans-serif",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(207,187,150,0.35)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(207,187,150,0.1)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        }}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      className="relative w-full py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] overflow-hidden transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                        color: "#0a0a0a",
                        fontFamily: "'Onest', sans-serif",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Shimmer */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                      />
                      <Send className="w-4 h-4" />
                      {sending ? "Отправка..." : "Отправить"}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { useCartStore } from "@/stores/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Send,
  ShieldCheck,
  Truck,
  Phone,
} from "lucide-react";

export default function StorefrontCart() {
  const { slug } = useParams<{ slug: string }>();
  const { data: site, isLoading } = useSiteBySlug(slug);

  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || items.length === 0) return;

    setSubmitting(true);
    try {
      const productList = items
        .map(
          (i) =>
            `${i.name} × ${i.quantity}${i.rrp ? ` (${(i.rrp * i.quantity).toLocaleString("ru-RU")} ₽)` : ""}`
        )
        .join("\n");

      const message = `🛒 Заказ:\n${productList}\n\nИтого: ${totalPrice().toLocaleString("ru-RU")} ₽${form.comment ? `\n\nКомментарий: ${form.comment}` : ""}`;

      const { error } = await supabase.from("leads").insert({
        name: form.name,
        phone: form.phone,
        message,
        site_id: items[0]?.siteId,
        source: "cart",
      });
      if (error) throw error;

      toast({
        title: "Заказ оформлен! 🎉",
        description: "Менеджер свяжется с вами в ближайшее время",
      });
      clearCart();
      setForm({ name: "", phone: "", comment: "" });
      setOrderSent(true);
    } catch {
      toast({ title: "Ошибка", description: "Попробуйте позже", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-storefront-text">
        <h1 className="text-2xl">Сайт не найден</h1>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0 bg-[#07090d]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-14">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8 text-xs">
            <Link
              to={`/store/${slug}`}
              className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Главная
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <Link
              to={`/store/${slug}/catalog`}
              className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Каталог
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <span className="uppercase tracking-[0.15em] text-storefront-text">Корзина</span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-storefront-gold/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-storefront-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-storefront-text uppercase tracking-wide">
                Корзина
              </h1>
              {items.length > 0 && (
                <p className="text-[13px] text-storefront-muted mt-1">
                  {totalItems()}{" "}
                  {totalItems() === 1 ? "товар" : totalItems() < 5 ? "товара" : "товаров"}
                </p>
              )}
            </div>
          </motion.div>

          {/* ===== ORDER SENT SUCCESS ===== */}
          {orderSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8"
              >
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-storefront-text mb-3">Заказ принят!</h2>
              <p className="text-[15px] text-storefront-muted text-center max-w-md mb-8 leading-relaxed">
                Мы получили ваш заказ и свяжемся с вами в ближайшее время для подтверждения
                и расчёта точной стоимости.
              </p>
              <Link
                to={`/store/${slug}/catalog`}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-storefront-gold hover:brightness-125 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться в каталог
              </Link>
            </motion.div>
          ) : items.length === 0 ? (
            /* ===== EMPTY CART ===== */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-storefront-gold/5 flex items-center justify-center mb-8"
              >
                <ShoppingBag className="w-10 h-10 text-storefront-gold/25" />
              </motion.div>
              <h2 className="text-xl font-bold text-storefront-text mb-2">Корзина пуста</h2>
              <p className="text-[14px] text-storefront-muted/60 text-center max-w-sm mb-8">
                Добавьте двери из каталога, чтобы оформить заказ
              </p>
              <Link
                to={`/store/${slug}/catalog`}
                className="inline-flex items-center gap-2 bg-storefront-gold text-[#07090d] font-bold text-[12px] uppercase tracking-[0.15em] px-8 py-3.5 rounded-xl hover:brightness-110 transition-all"
              >
                Перейти в каталог
              </Link>
            </motion.div>
          ) : (
            /* ===== CART CONTENT ===== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left — Products */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, scale: 0.95 }}
                      transition={{
                        layout: { duration: 0.3 },
                        delay: i * 0.05,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                      }}
                      className="group relative rounded-2xl overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                        border: "1px solid rgba(207,187,150,0.08)",
                      }}
                    >
                      {/* Hover glow */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-storefront-gold/0 group-hover:bg-storefront-gold/[0.05] blur-3xl transition-all duration-700 pointer-events-none" />

                      <div className="flex gap-5 p-5 relative z-10">
                        {/* Image */}
                        <Link
                          to={`/store/${slug}/product/${item.slug}`}
                          className="w-[100px] sm:w-[120px] h-[130px] sm:h-[160px] bg-[#0c0e14] rounded-xl overflow-hidden shrink-0 flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-storefront-muted/10 text-3xl font-bold">B</span>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/store/${slug}/product/${item.slug}`}
                              className="text-[14px] sm:text-[15px] font-semibold text-storefront-text uppercase tracking-wider leading-tight line-clamp-2 mb-2 hover:text-storefront-gold transition-colors"
                            >
                              {item.name}
                            </Link>
                            {item.rrp && (
                              <p className="text-[13px] text-storefront-muted">
                                {item.rrp.toLocaleString("ru-RU")} ₽ за шт.
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity */}
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:border-storefront-gold/20 transition-all"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <span className="w-12 text-center text-[15px] font-bold text-storefront-text tabular-nums">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:border-storefront-gold/20 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>

                            {/* Price + delete */}
                            <div className="flex items-center gap-4">
                              {item.rrp && (
                                <motion.span
                                  key={item.quantity}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-[17px] font-bold text-storefront-text"
                                >
                                  {(item.rrp * item.quantity).toLocaleString("ru-RU")}{" "}
                                  <span className="text-storefront-gold text-[14px]">₽</span>
                                </motion.span>
                              )}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => removeItem(item.id)}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-storefront-muted/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Clear cart */}
                <div className="flex justify-between items-center pt-2">
                  <Link
                    to={`/store/${slug}/catalog`}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Продолжить покупки
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-[11px] uppercase tracking-wider text-storefront-muted/30 hover:text-red-400 transition-colors"
                  >
                    Очистить корзину
                  </button>
                </div>
              </div>

              {/* Right — Order Summary + Form */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-6 rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(175deg, rgba(207,187,150,0.10) 0%, rgba(207,187,150,0.03) 100%)",
                    border: "1px solid rgba(207,187,150,0.12)",
                  }}
                >
                  {/* Summary */}
                  <div className="p-6 border-b border-white/[0.06]">
                    <h3 className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text mb-5">
                      Итого
                    </h3>

                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-storefront-muted">Товары ({totalItems()})</span>
                        <span className="text-storefront-text font-medium">
                          {totalPrice().toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-4 flex justify-between items-baseline">
                      <span className="text-[14px] font-semibold text-storefront-text">
                        К оплате
                      </span>
                      <div className="flex items-baseline gap-1">
                        <motion.span
                          key={totalPrice()}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold text-storefront-text"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {totalPrice().toLocaleString("ru-RU")}
                        </motion.span>
                        <span className="text-lg text-storefront-gold">₽</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout form */}
                  <form onSubmit={handleCheckout} className="p-6 space-y-4">
                    <h3 className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text mb-1">
                      Оформить заказ
                    </h3>
                    <p className="text-[12px] text-storefront-muted/60 mb-4">
                      Менеджер свяжется для подтверждения и расчёта стоимости
                    </p>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] text-storefront-text text-[14px] px-4 py-3.5 rounded-xl placeholder:text-storefront-muted/30 focus:outline-none focus:border-storefront-gold/40 transition-colors"
                        placeholder="Иван"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] text-storefront-text text-[14px] px-4 py-3.5 rounded-xl placeholder:text-storefront-muted/30 focus:outline-none focus:border-storefront-gold/40 transition-colors"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">
                        Комментарий
                      </label>
                      <textarea
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] text-storefront-text text-[14px] px-4 py-3.5 rounded-xl placeholder:text-storefront-muted/30 focus:outline-none focus:border-storefront-gold/40 transition-colors resize-none"
                        placeholder="Необязательно"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-storefront-gold text-[#07090d] font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10 flex items-center gap-3">
                        <Send className="w-4 h-4" />
                        {submitting ? "Отправка..." : "Оформить заказ"}
                      </span>
                    </motion.button>

                    <p className="text-[10px] text-storefront-muted/30 text-center leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </form>

                  {/* Trust badges */}
                  <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                    {[
                      { icon: ShieldCheck, text: "Гарантия качества" },
                      { icon: Truck, text: "Доставка по Москве" },
                      { icon: Phone, text: "Поддержка 24/7" },
                      { icon: ShoppingBag, text: "Безопасный заказ" },
                    ].map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className="flex items-center gap-2 text-[10px] text-storefront-muted/40"
                      >
                        <Icon className="w-3.5 h-3.5 text-storefront-gold/30 shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}

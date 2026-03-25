import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Send } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

const DRAWER_VARIANTS = {
  hidden: { x: "100%", opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, damping: 30, stiffness: 300, mass: 0.8 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.25 } },
};

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();

  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || items.length === 0) return;

    setSubmitting(true);
    try {
      const productList = items
        .map((i) => `${i.name} × ${i.quantity}${i.rrp ? ` (${(i.rrp * i.quantity).toLocaleString("ru-RU")} ₽)` : ""}`)
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

      toast({ title: "Заказ оформлен! 🎉", description: "Менеджер свяжется с вами в ближайшее время" });
      clearCart();
      setForm({ name: "", phone: "", comment: "" });
      setCheckout(false);
      closeCart();
    } catch {
      toast({ title: "Ошибка", description: "Попробуйте позже", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={DRAWER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-0 bottom-0 w-full max-w-[480px] flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #0c0e14 0%, #07090d 100%)",
              borderLeft: "1px solid rgba(207,187,150,0.08)",
              boxShadow: "-20px 0 80px rgba(0,0,0,0.5), -5px 0 30px rgba(207,187,150,0.03)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-storefront-gold/10 flex items-center justify-center">
                  <ShoppingBag className="w-4.5 h-4.5 text-storefront-gold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold uppercase tracking-[0.15em] text-storefront-text">
                    {checkout ? "Оформление" : "Корзина"}
                  </h2>
                  {!checkout && (
                    <span className="text-[11px] text-storefront-muted">
                      {totalItems()} {totalItems() === 1 ? "товар" : totalItems() < 5 ? "товара" : "товаров"}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { if (checkout) setCheckout(false); else closeCart(); }}
                className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {checkout ? (
                  /* ===== CHECKOUT FORM ===== */
                  <motion.form
                    key="checkout"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleCheckout}
                    className="p-6 space-y-4"
                  >
                    {/* Order summary */}
                    <div
                      className="rounded-2xl p-4 mb-2"
                      style={{
                        background: "linear-gradient(135deg, rgba(207,187,150,0.08) 0%, rgba(207,187,150,0.02) 100%)",
                        border: "1px solid rgba(207,187,150,0.1)",
                      }}
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-gold/60 block mb-3">Ваш заказ</span>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-[13px] py-1.5">
                          <span className="text-storefront-muted">{item.name} × {item.quantity}</span>
                          {item.rrp && (
                            <span className="text-storefront-text font-medium">
                              {(item.rrp * item.quantity).toLocaleString("ru-RU")} ₽
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="border-t border-white/[0.06] mt-3 pt-3 flex justify-between">
                        <span className="text-[13px] font-semibold text-storefront-text">Итого</span>
                        <span className="text-lg font-bold text-storefront-gold">
                          {totalPrice().toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">Ваше имя *</label>
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
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">Телефон *</label>
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
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 mb-2">Комментарий</label>
                      <textarea
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        rows={2}
                        className="w-full bg-white/[0.04] border border-white/[0.08] text-storefront-text text-[14px] px-4 py-3.5 rounded-xl placeholder:text-storefront-muted/30 focus:outline-none focus:border-storefront-gold/40 transition-colors resize-none"
                        placeholder="Комментарий к заказу (необязательно)"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-storefront-gold text-[#07090d] font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Отправка..." : "Оформить заказ"}
                    </motion.button>

                    <p className="text-[11px] text-storefront-muted/40 text-center leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                      Менеджер свяжется для подтверждения заказа и расчёта стоимости.
                    </p>
                  </motion.form>
                ) : items.length === 0 ? (
                  /* ===== EMPTY STATE ===== */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-6"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-3xl bg-storefront-gold/5 flex items-center justify-center mb-6"
                    >
                      <ShoppingBag className="w-8 h-8 text-storefront-gold/30" />
                    </motion.div>
                    <p className="text-[15px] font-semibold text-storefront-text mb-2">Корзина пуста</p>
                    <p className="text-[13px] text-storefront-muted/60 text-center max-w-[280px]">
                      Добавьте двери из каталога, чтобы оформить заказ
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-6 text-[12px] uppercase tracking-[0.15em] text-storefront-gold hover:brightness-125 transition-all"
                    >
                      Перейти в каталог
                    </button>
                  </motion.div>
                ) : (
                  /* ===== ITEM LIST ===== */
                  <motion.div key="items" className="p-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          layout
                          custom={i}
                          variants={ITEM_VARIANTS}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="group relative rounded-2xl overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                            border: "1px solid rgba(207,187,150,0.08)",
                          }}
                        >
                          {/* Hover glow */}
                          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-storefront-gold/0 group-hover:bg-storefront-gold/[0.06] blur-3xl transition-all duration-700 pointer-events-none" />

                          <div className="flex gap-4 p-4 relative z-10">
                            {/* Image */}
                            <div className="w-[80px] h-[100px] bg-[#0c0e14] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-storefront-muted/10 text-2xl font-bold">B</span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h3 className="text-[13px] font-semibold text-storefront-text uppercase tracking-wider leading-tight line-clamp-2 mb-1">
                                  {item.name}
                                </h3>
                                {item.rrp && (
                                  <span className="text-[15px] font-bold text-storefront-text">
                                    {(item.rrp * item.quantity).toLocaleString("ru-RU")} <span className="text-storefront-gold text-[13px]">₽</span>
                                  </span>
                                )}
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-0.5">
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <span className="w-10 text-center text-[14px] font-bold text-storefront-text tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>

                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => removeItem(item.id)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-storefront-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer — only when items exist and not in checkout */}
            {items.length > 0 && !checkout && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-t border-white/[0.06] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-storefront-muted">Итого</span>
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      key={totalPrice()}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-storefront-text"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {totalPrice().toLocaleString("ru-RU")}
                    </motion.span>
                    <span className="text-lg text-storefront-gold">₽</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCheckout(true)}
                  className="w-full bg-storefront-gold text-[#07090d] font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    Оформить заказ
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>

                <button
                  onClick={clearCart}
                  className="w-full text-[11px] uppercase tracking-[0.15em] text-storefront-muted/40 hover:text-red-400 transition-colors py-1"
                >
                  Очистить корзину
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

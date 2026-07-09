import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useNavigate } from "react-router-dom";
import { storeHref } from "@/lib/storeHref";

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
    transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
  exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.25 } },
};

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCartStore();
  const navigate = useNavigate();

  const goToCart = () => {
    // Extract slug from first item's siteId — we need the slug from URL
    closeCart();
    // Find slug from current URL
    const match = window.location.pathname.match(/\/store\/([^/]+)/);
    const slug = match?.[1] || "";
    if (slug) navigate(storeHref(slug, "cart"));
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
            className="absolute inset-0 bg-black/70"
          />

          {/* Drawer */}
          <motion.div
            variants={DRAWER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] flex flex-col overflow-hidden"
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
                  <ShoppingBag className="w-4 h-4 text-storefront-gold" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold uppercase tracking-[0.15em] text-storefront-text">
                    Корзина
                  </h2>
                  <span className="text-[11px] text-storefront-muted">
                    {totalItems()} {totalItems() === 1 ? "товар" : totalItems() < 5 ? "товара" : "товаров"}
                  </span>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {items.length === 0 ? (
                /* ===== EMPTY STATE ===== */
                <motion.div
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
                <div className="p-4 space-y-3">
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
                        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-storefront-gold/0 group-hover:bg-storefront-gold/[0.06] blur-3xl transition-all duration-700 pointer-events-none" />

                        <div className="flex gap-4 p-4 relative z-10">
                          {/* Image */}
                          <div className="w-[70px] h-[90px] bg-[#0c0e14] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-storefront-muted/10 text-2xl font-bold">B</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              {item.type && item.type !== "door" && (
                                <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full mb-1 inline-block ${
                                  item.type === "trim" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"
                                }`}>
                                  {item.type === "trim" ? "Погонаж" : "Фурнитура"}
                                </span>
                              )}
                              <h3 className="text-[12px] font-semibold text-storefront-text uppercase tracking-wider leading-tight line-clamp-2 mb-1">
                                {item.name}
                              </h3>
                              {item.rrp && item.rrp > 0 ? (
                                <span className="text-[12px] font-semibold text-storefront-gold tabular-nums">
                                  {(item.rrp * item.quantity).toLocaleString("ru-RU")} ₽
                                  {item.quantity > 1 && (
                                    <span className="text-[10px] text-storefront-muted/60 font-normal ml-1">
                                      ({item.rrp.toLocaleString("ru-RU")} × {item.quantity})
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-[11px] text-storefront-muted">
                                  Цена по запросу
                                </span>
                              )}

                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-0.5">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </motion.button>
                                <span className="w-8 text-center text-[13px] font-bold text-storefront-text tabular-nums">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-storefront-muted hover:text-storefront-text hover:bg-white/[0.08] transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>

                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => removeItem(item.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-storefront-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="border-t border-white/[0.06] p-6 space-y-4"
              >
                {(() => {
                  const pricedSum = items.reduce(
                    (s, i) => s + (i.rrp && i.rrp > 0 ? i.rrp * i.quantity : 0),
                    0
                  );
                  const hasUnpriced = items.some((i) => !i.rrp || i.rrp <= 0);
                  const allUnpriced = pricedSum === 0;
                  return (
                    <>
                      {!allUnpriced && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] uppercase tracking-[0.15em] text-storefront-muted/70">
                            {hasUnpriced ? "Предварительно" : "Итого"}
                          </span>
                          <span className="text-[20px] font-bold text-storefront-gold tabular-nums">
                            {pricedSum.toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                      )}
                      <div className="text-[11px] text-storefront-muted/70 leading-relaxed">
                        {allUnpriced
                          ? "Стоимость рассчитает менеджер после согласования конфигурации"
                          : hasUnpriced
                          ? "Часть позиций — по запросу, менеджер уточнит итоговую сумму"
                          : "Финальную сумму подтвердит менеджер после согласования"}
                      </div>
                    </>
                  );
                })()}


                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToCart}
                  className="w-full bg-storefront-gold text-[#07090d] font-bold text-[13px] uppercase tracking-[0.15em] py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10 flex items-center gap-3">
                    Перейти к оформлению
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

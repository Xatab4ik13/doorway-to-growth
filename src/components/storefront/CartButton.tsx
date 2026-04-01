import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

export function CartButton() {
  const { toggleCart, totalItems } = useCartStore();
  const count = totalItems();

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
      style={{
        background: count > 0
          ? "linear-gradient(135deg, rgba(207,187,150,0.15) 0%, rgba(207,187,150,0.05) 100%)"
          : "rgba(255,255,255,0.04)",
        border: count > 0
          ? "1px solid rgba(207,187,150,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <ShoppingBag className="w-[18px] h-[18px] text-storefront-gold/70" />

      {/* Badge */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-full bg-storefront-gold flex items-center justify-center px-1"
          >
            <motion.span
              key={count}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[10px] font-bold text-[#07090d] leading-none"
            >
              {count}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring when items exist */}
      {count > 0 && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-storefront-gold/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}

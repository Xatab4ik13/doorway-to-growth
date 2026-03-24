import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts } from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StorefrontProduct() {
  const { slug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const { data: site, isLoading: siteLoading } = useSiteBySlug(slug);
  const { data: products = [], isLoading: productsLoading } = useStorefrontProducts(site?.id);

  const product = (products as any[]).find((p) => p.slug === productSlug);

  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const images = product?.product_images
    ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const specs = product?.specifications as Record<string, string> | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        phone: formData.phone,
        message: formData.message || `Интересует: ${product?.name}`,
        product_id: product?.id,
        site_id: site?.id,
        source: "catalog",
      });
      if (error) throw error;
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время" });
      setFormData({ name: "", phone: "", message: "" });
    } catch {
      toast({ title: "Ошибка", description: "Попробуйте позже", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  if (siteLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-storefront-bg flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site || !product) {
    return (
      <div className="min-h-screen bg-storefront-bg flex items-center justify-center text-storefront-text">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Товар не найден</h1>
          <Link to={`/store/${slug}/catalog`} className="text-storefront-gold hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0">
        <div className="max-w-[1400px] mx-auto px-6 py-10 md:py-16">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <Link
              to={`/store/${slug}`}
              className="text-xs uppercase tracking-[0.2em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Главная
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <Link
              to={`/store/${slug}/catalog`}
              className="text-xs uppercase tracking-[0.2em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Каталог
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <span className="text-xs uppercase tracking-[0.2em] text-storefront-gold">{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-[3/4] bg-storefront-card overflow-hidden group">
                {images.length > 0 ? (
                  <img
                    src={images[currentImage]?.url}
                    alt={images[currentImage]?.alt || product.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-storefront-muted/30 text-8xl font-bold">B</span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-storefront-bg/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-storefront-gold hover:text-storefront-bg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-storefront-bg/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-storefront-gold hover:text-storefront-bg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-1 mt-1">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`flex-1 aspect-square overflow-hidden border-2 transition-colors ${
                        idx === currentImage ? "border-storefront-gold" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {product.categories && (
                <span className="text-xs uppercase tracking-[0.2em] text-storefront-gold/70 mb-2">
                  {(product.categories as any)?.name}
                </span>
              )}

              <h1
                className="text-3xl sm:text-4xl font-bold text-storefront-text uppercase tracking-wide mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
              </h1>

              {product.rrp && (
                <p className="text-2xl text-storefront-gold font-medium mb-6">
                  от {Number(product.rrp).toLocaleString("ru-RU")} ₽
                </p>
              )}

              {product.description && (
                <p className="text-storefront-muted text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Specifications */}
              {specs && Object.keys(specs).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-storefront-gold mb-4">Характеристики</h3>
                  <div className="space-y-0">
                    {Object.entries(specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 border-b border-white/5 text-sm"
                      >
                        <span className="text-storefront-muted capitalize">{key}</span>
                        <span className="text-storefront-text">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead form */}
              <div className="mt-auto pt-8 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-[0.2em] text-storefront-gold mb-4">
                  Узнать цену и наличие
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-transparent border border-storefront-gold/20 text-storefront-text text-sm px-4 py-3 placeholder:text-storefront-muted/50 focus:outline-none focus:border-storefront-gold transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full bg-transparent border border-storefront-gold/20 text-storefront-text text-sm px-4 py-3 placeholder:text-storefront-muted/50 focus:outline-none focus:border-storefront-gold transition-colors"
                  />
                  <textarea
                    placeholder="Сообщение (необязательно)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border border-storefront-gold/20 text-storefront-text text-sm px-4 py-3 placeholder:text-storefront-muted/50 focus:outline-none focus:border-storefront-gold transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-storefront-gold text-storefront-bg font-semibold text-xs uppercase tracking-wider py-4 hover:bg-storefront-gold-light transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Отправка..." : "Оставить заявку"}
                  </button>
                </form>

                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-storefront-muted hover:text-storefront-gold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    или позвоните: {site.phone}
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Back button */}
          <div className="mt-16">
            <Link
              to={`/store/${slug}/catalog`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

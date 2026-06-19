import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { storeHref } from "@/lib/storeHref";
import { resolveStorageUrl } from "@/lib/storageUrl";

interface Product {
  id: string;
  name: string;
  slug: string;
  rrp: number | null;
  description: string | null;
  categories: { name: string; slug: string } | null;
  product_images: Array<{ url: string; alt: string | null; is_primary: boolean | null; sort_order: number | null }>;
}

interface Props {
  products: Product[];
  categories: Array<{ id: string; name: string; slug: string }>;
  siteSlug: string;
}

export function CatalogSection({ products, categories, siteSlug }: Props) {
  const getPrimaryImage = (p: Product) => {
    const primary = p.product_images?.find((i) => i.is_primary);
    return resolveStorageUrl(primary?.url || p.product_images?.[0]?.url);
  };

  return (
    <section id="catalog" className="py-20 bg-storefront-bg relative">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[1px] bg-storefront-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-storefront-gold">Каталог</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-storefront-text">
              Наши <span className="text-storefront-gold">двери</span>
            </h2>
          </div>
          <Link
            to={storeHref(siteSlug, "catalog")}
            className="text-xs uppercase tracking-wider text-storefront-gold border border-storefront-gold/30 px-5 py-2.5 hover:bg-storefront-gold hover:text-storefront-bg transition-all"
          >
            Смотреть все
          </Link>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button className="px-4 py-2 text-xs uppercase tracking-wider bg-storefront-gold text-storefront-bg font-medium">
              Все
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="px-4 py-2 text-xs uppercase tracking-wider border border-storefront-gold/20 text-storefront-muted hover:border-storefront-gold hover:text-storefront-gold transition-all"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Product grid — dark cards like go.arch reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {products.slice(0, 8).map((product) => {
            const img = getPrimaryImage(product);
            return (
              <Link
                key={product.id}
                to={storeHref(siteSlug, `product/${product.slug}`)}
                className="group relative aspect-[3/4] bg-storefront-card overflow-hidden cursor-pointer block"
              >
                {img ? (
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-storefront-card flex items-center justify-center">
                    <span className="text-storefront-muted/30 text-6xl font-bold">B</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-storefront-bg via-storefront-bg/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {product.categories && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-gold/70 mb-1 block">
                      {(product.categories as any)?.name || ""}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-storefront-text leading-snug uppercase tracking-wide">
                    {product.name}
                  </h3>
                  {product.rrp && (
                    <p className="mt-1 text-sm text-storefront-gold font-medium">
                      от {product.rrp.toLocaleString("ru-RU")} ₽
                    </p>
                  )}
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-storefront-gold" />
                </div>
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-storefront-muted">
            Каталог скоро будет доступен
          </div>
        )}
      </div>
    </section>
  );
}

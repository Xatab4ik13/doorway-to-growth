import { ReactNode } from "react";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFooter } from "./StorefrontFooter";
import { CartDrawer } from "./CartDrawer";
import { PageTransition } from "./PageTransition";

interface Props {
  site: StorefrontSite;
  children: ReactNode;
}

export function StorefrontLayout({ site, children }: Props) {
  return (
    <div className="min-h-screen bg-storefront-bg text-storefront-text" style={{ fontFamily: "'Onest', system-ui, sans-serif", fontFeatureSettings: "'tnum' 1, 'lnum' 1, 'ss01' 1" }}>
      <StorefrontHeader site={site} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <StorefrontFooter site={site} />
      <CartDrawer />
    </div>
  );
}

import { ReactNode } from "react";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFooter } from "./StorefrontFooter";

interface Props {
  site: StorefrontSite;
  children: ReactNode;
}

export function StorefrontLayout({ site, children }: Props) {
  return (
    <div className="min-h-screen bg-storefront-bg text-storefront-text" style={{ fontFamily: "'Raleway', system-ui, sans-serif" }}>
      <StorefrontHeader site={site} />
      <main>{children}</main>
      <StorefrontFooter site={site} />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import { getProducts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse CozeGear automatic ironing machines and smart garment care products.",
};

export default async function ProductsPage() {
  const products = await getProducts(24);

  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Products</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Automatic ironing machines</h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Browse WooCommerce products in a faster Next.js storefront. Product names, prices and images are loaded from WordPress.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--soft)] py-5">
        <div className="section-shell flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal size={18} />
            <span>{products.length} products</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            {["Home garment care", "Online ordering", "WooCommerce checkout"].map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <CheckCircle2 className="text-[var(--accent)]" size={16} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="section-shell">
          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard product={product} showExcerpt key={product.id} />
              ))}
            </div>
          ) : (
            <div className="rounded border border-[var(--line)] bg-white p-8 text-[var(--muted)]">
              Products could not be loaded from WooGraphQL.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Need help?</p>
            <h2 className="mt-3 text-3xl font-semibold">Ask us before choosing a model</h2>
          </div>
          <Link href="/contact-us" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]">
            Contact us <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

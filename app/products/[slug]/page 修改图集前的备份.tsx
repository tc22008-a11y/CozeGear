import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronDown, Play, Quote, ShieldCheck, Star, Truck } 
/* 新增的 Lucide 图标 */
  Clock, 
  Wand2, 
  Wind, 
  Sparkles, 
  Shield, 
  PlaySquare, 
  Briefcase, 
  Users, 
  GraduationCap, 
  Check, 
  X,
  Zap,
  Shirt,
  Search,
  Globe // <--- ✨ 在这里加上 Globe
from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductStickyActions } from "@/components/product-sticky-actions";
import { SiteShell } from "@/components/site-shell";
import {
  getProductAlt,
  getProductBySlug,
  getProductGallery,
  getProductRating,
  getProducts,
  getWordPressAddToCartUrl,
  stripHtml,
} from "@/lib/wordpress";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description:
      stripHtml(product.shortDescription || product.description) ||
      `${product.name} from CozeGear automatic garment care products.`,
  };
}

export async function generateStaticParams() {
  const products = await getProducts(24);
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const gallery = getProductGallery(product);
  const buyUrl = getWordPressAddToCartUrl(product);
  const { rating, reviewCount } = getProductRating(product);
  const reviews = product.reviews?.nodes || [];
  const relatedProducts = (await getProducts(4)).filter((item) => item.slug !== product.slug).slice(0, 4);
  const description = product.description || product.shortDescription;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: gallery.map((image) => image.sourceUrl),
    description: stripHtml(description),
    aggregateRating: reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price?.replace(/[^0-9.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: `https://jianx144.sg-host.com/product/${product.slug}/`,
    },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductStickyActions buyUrl={buyUrl} />

      <section className="bg-white py-10 lg:py-14">
        <div className="product-detail-shell grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:items-start xl:gap-10">
          <ProductGallery images={gallery} fallbackAlt={getProductAlt(product)} />

          <aside className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">CozeGear product</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex text-[var(--accent)]" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={18} strokeWidth={1.4} key={index} />
                ))}
              </div>
              <Link href="#product-reviews" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
                {rating.toFixed(1)} / 5 · {reviewCount} reviews
              </Link>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-semibold text-[var(--accent)]">{product.salePrice || product.price}</span>
              {product.regularPrice && product.salePrice && product.regularPrice !== product.salePrice ? (
                <span className="pb-1 text-lg text-[var(--muted)] line-through">{product.regularPrice}</span>
              ) : null}
            </div>
            {product.shortDescription ? (
              <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{stripHtml(product.shortDescription)}</p>
            ) : null}
            <div className="mt-8 grid gap-3" id="product-buy-actions">
              <Link href={buyUrl} className="focus-ring inline-flex h-13 items-center justify-center gap-2 rounded bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]">
                Buy now <ArrowRight size={18} />
              </Link>
              <Link href="/contact-us" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded border border-[var(--line)] bg-white px-6 text-sm font-semibold hover:bg-[var(--soft)]">
                Ask a question
              </Link>
            </div>
            <div className="mt-8 grid gap-3 border-y border-[var(--line)] py-5">
              {[
                { icon: Truck, text: "Online ordering through WooCommerce checkout" },
                { icon: ShieldCheck, text: "Secure checkout handled by your WordPress store" },
                { icon: CheckCircle2, text: "Product content loaded from WordPress" },
              ].map(({ icon: Icon, text }) => (
                <div className="flex items-center gap-3 text-sm font-medium" key={text}>
                  <Icon className="text-[var(--accent)]" size={19} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <div className="relative min-h-[420px] overflow-hidden rounded bg-[var(--foreground)] text-white">
            {gallery[0] ? (
              <Image src={gallery[0].sourceUrl} alt={gallery[0].altText || getProductAlt(product)} fill sizes="(min-width: 1200px) 70vw, 100vw" className="object-cover opacity-70" />
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button className="focus-ring mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--accent)]" aria-label="Play product video">
                <Play size={26} fill="currentColor" />
              </button>
              <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Product video area</h2>
              <p className="mt-4 max-w-xl text-white/85">Use this module for a real product video later. For now it uses your WordPress product image.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {gallery.slice(1, 4).map((image, index) => (
              <div className="relative min-h-32 overflow-hidden rounded bg-[var(--soft)]" key={`${image.sourceUrl}-trust-${index}`}>
                <Image src={image.sourceUrl} alt={image.altText || getProductAlt(product)} fill sizes="(min-width: 1200px) 30vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Details</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Product information</h2>
          </div>
          <div className="rounded border border-[var(--line)] bg-white p-6 leading-8 text-[var(--muted)]">
            {description ? (
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p>Product details can be edited in WordPress and will appear here.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="product-reviews">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Customer reviews</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Reviews from WordPress</h2>
            </div>
            <div className="flex items-center gap-3 rounded border border-[var(--line)] bg-[var(--soft)] px-4 py-3">
              <div className="flex text-[var(--accent)]" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={18} strokeWidth={1.5} key={index} />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating.toFixed(1)} / 5</span>
              <span className="text-sm text-[var(--muted)]">{reviewCount} reviews</span>
            </div>
          </div>
          {reviews.length ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {reviews.slice(0, 6).map((review) => (
                <article className="min-h-64 rounded border border-[var(--line)] bg-[var(--background)] p-6" key={review.id}>
                  <Quote className="text-[var(--accent)]" size={28} strokeWidth={1.7} />
                  <div className="mt-5 flex text-[var(--accent)]" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={16} strokeWidth={1.4} key={index} />
                    ))}
                  </div>
                  <p className="mt-5 line-clamp-6 leading-7 text-[var(--muted)]">{stripHtml(review.content)}</p>
                  <div className="mt-6 border-t border-[var(--line)] pt-4">
                    <p className="font-semibold">{review.author?.node?.name || "Verified customer"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">WordPress product review</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded border border-[var(--line)] bg-[var(--background)] p-8 text-[var(--muted)]">
              Product reviews from WordPress will appear here.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Before you order</h2>
          </div>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {[
              ["Where does checkout happen?", "The current button sends customers to your WordPress WooCommerce cart, so payment stays inside your existing store setup."],
              ["Can this page use more product images later?", "Yes. Add gallery images in WooCommerce and this page can display them automatically."],
              ["Can live chat be added here?", "Yes. A contact entry is already reserved on the frontend, and a live chat provider can be connected later."],
            ].map(([question, answer]) => (
              <details className="group py-5" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {question}
                  <ChevronDown className="shrink-0 transition group-open:rotate-180" size={19} />
                </summary>
                <p className="mt-3 leading-7 text-[var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="py-16">
          <div className="section-shell">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">More products</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">You may also like</h2>
              </div>
              <Link href="/products" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                View all products <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard product={relatedProduct} key={relatedProduct.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}

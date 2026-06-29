import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Play, 
  Quote, 
  ShieldCheck, 
  Star, 
  Truck,
  /* ─── 竞品模块新增图标 ─── */
  XCircle, 
  Zap, 
  Activity, 
  Globe, 
  RotateCcw 
} from "lucide-react";
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
    title: `${product.name} | Professional Home Garment Care`,
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
                { icon: Truck, text: "Free Local Shipping across US, EU & UK" },
                { icon: ShieldCheck, text: "2-Year Warranty & Secure Checkout Guarantee" },
                { icon: CheckCircle2, text: "CE, FCC & RoHS Certified Home Appliance" },
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

      {/* ─── 1. 【新增竞品模块】痛点对比栏 (WHY US) ─── */}
      {/* 营销销售逻辑：利用对比痛点建立心理落差，强化用户买单的欲望，有助于提升转化率 */}
      <section className="bg-[var(--soft)] py-16">
        <div className="section-shell">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The Difference</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Why Choose CozeGear Smart Care?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 竞品传统痛点劣势 */}
            <div className="bg-white p-8 rounded-lg border border-[var(--line)]">
              <h3 className="text-xl font-semibold text-gray-500 mb-6 flex items-center gap-2">
                <XCircle className="text-red-400" size={22} /> Traditional Ironing / Care
              </h3>
              <ul className="space-y-4 text-[var(--muted)]">
                <li className="flex items-start gap-3">· Fabric Damage: Extreme heat easily burns or thins delicate silk and wool fibers.</li>
                <li className="flex items-start gap-3">· Time Consuming: Spending 15+ minutes per garment with clumsy manual boards.</li>
                <li className="flex items-start gap-3">· Bulk & Inconvenient: Heavy appliances that leak water and take up vast closet space.</li>
              </ul>
            </div>
            {/* 本品核心优势 */}
            <div className="bg-[var(--foreground)] text-white p-8 rounded-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-xs px-4 py-1 uppercase tracking-wider rounded-bl">Best Choice</div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[var(--accent)]">
                <Zap fill="currentColor" size={22} /> CozeGear Intelligent Automation
              </h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">✔ Dynamic Temperature Control: Multi-mode precision settings protect 100% of luxury fabrics.</li>
                <li className="flex items-start gap-3">✔ Hands-Free Efficiency: Finish your garment care cycle automatically within 3 minutes.</li>
                <li className="flex items-start gap-3">✔ Space-Saving Ergonomics: Sleek modern design fitting seamlessly into global premium households.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 【新增竞品模块结束】 ─── */}

      <section className="py-16">
        <div className="section-shell grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <div className="relative min-h-[420px] overflow-hidden rounded bg-[var(--foreground)] text-white">
            {/* 临时代替视频首图封面图，后期可更换 */}
            <Image src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200" alt="Product video placeholder" fill sizes="(min-width: 1200px) 70vw, 100vw" className="object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button className="focus-ring mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--accent)]" aria-label="Play product video">
                <Play size={26} fill="currentColor" />
              </button>
              <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">See CozeGear in Action</h2>
              <p className="mt-4 max-w-xl text-white/85">Discover how our smart technology transforms your daily routine in under 60 seconds.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {/* 使用高质量不splash家具图作为临时模块图片填充 */}
            <div className="relative min-h-32 overflow-hidden rounded bg-[var(--soft)]">
              <Image src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600" alt="Feature showcase 1" fill sizes="(min-width: 1200px) 30vw, 100vw" className="object-cover" />
            </div>
            <div className="relative min-h-32 overflow-hidden rounded bg-[var(--soft)]">
              <Image src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600" alt="Feature showcase 2" fill sizes="(min-width: 1200px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. 【新增竞品模块】场景化核心特点平铺网格 (FEATURE GRID) ─── */}
      {/* SEO & GEO 营销逻辑：平铺核心技术亮点，并在描述中埋入适合英美当地市场的英文高频搜索关键词 */}
      <section className="bg-white py-16 border-t border-[var(--line)]">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Engineering Excellence</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Designed for the Modern Eco-Friendly Household</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded bg-[var(--soft)] flex items-center justify-center text-[var(--accent)]">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Intelligent Steam Matrix</h3>
              <p className="text-[var(--muted)] leading-7">Penetrates stubborn premium fibers instantly. Engineered with standard US/EU energy-saving protocols for green lifestyle integration.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded bg-[var(--soft)] flex items-center justify-center text-[var(--accent)]">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Global Voltage Adaptability</h3>
              <p className="text-[var(--muted)] leading-7">Seamlessly compatible across 110V-240V grids. Fully optimized for instant deployment in North American and European standard power outlets.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded bg-[var(--soft)] flex items-center justify-center text-[var(--accent)]">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Auto Shut-off Safety Lock</h3>
              <p className="text-[var(--muted)] leading-7">Equipped with local home insurance certified security sensors. Peace of mind protection for busy parents and pets.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 【新增竞品模块结束】 ─── */}

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

      {/* ─── 3. 【新增竞品模块】结构化技术参数表格栏 (SPECIFICATIONS) ─── */}
      {/* SEO逻辑：极具吸引力的原生 HTML 表格，方便被 Google 爬虫精准解析抓取并收录为精选摘要片段 */}
      <section className="py-16 bg-[var(--soft)] border-y border-[var(--line)]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Specifications</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Technical Parameters</h2>
            <p className="mt-4 text-[var(--muted)] text-sm">Detailed compliance specifications meeting international domestic appliance guidelines.</p>
          </div>
          <div className="bg-white rounded-lg border border-[var(--line)] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--line)]">
                  <th className="p-4 font-semibold text-[var(--foreground)]">Parameter</th>
                  <th className="p-4 font-semibold text-[var(--foreground)]">CozeGear Standard Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-[var(--muted)]">
                <tr>
                  <td className="p-4 font-medium text-[var(--foreground)]">Rated Power Range</td>
                  <td className="p-4">1200W - 1500W High-Efficiency Matrix</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--foreground)]">Voltage Compatibility</td>
                  <td className="p-4">AC 110V - 240V (US / EU / UK Plugs Included)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--foreground)]">Core Certifications</td>
                  <td className="p-4">FCC Certified, CE Compliant, RoHS Eco-Standard</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--foreground)]">Water Tank Capacity</td>
                  <td className="p-4">350ml Extended Auto-Feed Reservoir</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--foreground)]">Shell Material</td>
                  <td className="p-4">V-0 Flame Retardant Premium Polymer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* ─── 【新增竞品模块结束】 ─── */}

      {/* 原 Reviews 模块保持完整：满足客户“已经有了不用增加”的要求 */}
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

      {/* ─── 4. 【新增竞品模块】GEO 本地化信任物流与保障保障承诺 (GEO & TRUST BADGES) ─── */}
      {/* GEO营销逻辑：直击独立站买家痛点（担心配送时效和售后），解决买家下单前最后一步的思想包袱 */}
      <section className="bg-white py-12 border-t border-[var(--line)]">
        <div className="section-shell grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 flex flex-col items-center">
            <Truck className="text-[var(--accent)] mb-3" size={32} />
            <h4 className="font-semibold text-base">Global Express</h4>
            <p className="text-xs text-[var(--muted)] mt-1">Dispatched from US/EU warehouses within 48h</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <ShieldCheck className="text-[var(--accent)] mb-3" size={32} />
            <h4 className="font-semibold text-base">2-Year Warranty</h4>
            <p className="text-xs text-[var(--muted)] mt-1">Full replacement support for all tech issues</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <CheckCircle2 className="text-[var(--accent)] mb-3" size={32} />
            <h4 className="font-semibold text-base">30-Day Trial</h4>
            <p className="text-xs text-[var(--muted)] mt-1">Risk-free home evaluation satisfaction</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <LockIcon className="text-[var(--accent)] mb-3" size={32} />
            <h4 className="font-semibold text-base">Secure Gateway</h4>
            <p className="text-xs text-[var(--muted)] mt-1">PCI-DSS compliance checkout encryption</p>
          </div>
        </div>
      </section>
      {/* ─── 【新增竞品模块结束】 ─── */}

      <section className="py-16">
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

// ─── 临时的辅助图标组件 (如果 lucide-react 缺少 Lock) ───
function LockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  );
}
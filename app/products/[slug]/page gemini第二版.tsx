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
  Globe // <--- 这次它真的在这里了！
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
    title: `${product.name} | Professional Automatic Ironing Machine`,
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

      {/* ─── 1. Hero Gallery & 购买区 开始 ─── */}
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
                { icon: Truck, text: "Free Local Shipping & Easy Returns" },
                { icon: ShieldCheck, text: "2-Year Comprehensive Warranty" },
                { icon: CheckCircle2, text: "Safe & Secure Checkout Guaranteed" },
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
      {/* ─── 1. Hero Gallery & 购买区 结束 ─── */}

      {/* ─── 2. 视频区 开始 ─── */}
      <section className="bg-[var(--soft)] py-16">
        <div className="section-shell">
          <div className="relative min-h-[500px] md:min-h-[600px] w-full overflow-hidden rounded-xl bg-[var(--foreground)] text-white shadow-xl">
            {/* 后期替换为真实的视频封面图 */}
            <Image src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1600" alt="Product video placeholder" fill className="object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button className="focus-ring mb-5 grid h-20 w-20 place-items-center rounded-full bg-white text-[var(--accent)] hover:scale-105 transition-transform" aria-label="Play product video">
                <Play size={32} fill="currentColor" className="ml-1" />
              </button>
              <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Experience the Future of Garment Care</h2>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 2. 视频区 结束 ─── */}

      {/* ─── 3. GEO模块 (SEO+GEO H1相关FAQ答案块) 开始 ─── */}
      {/* 完全按照图片要求放置在视频之后，采用原生HTML标签结构利于Google爬虫抓取 */}
      <section className="bg-white py-16 border-b border-[var(--line)]">
        <div className="section-shell max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-[var(--muted)]">
            <h2 className="text-3xl font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
               <Search className="text-[var(--accent)]" /> What Is An Automatic Ironing Machine?
            </h2>
            <p className="leading-8 mb-10">
              An automatic ironing machine removes wrinkles, sanitizes, and refreshes garments completely hands-free. By utilizing advanced steam technology and dynamic temperature control, it eliminates the need for a traditional ironing board. Simply hang your clothes, and the machine restores them to a crisp, dry-cleaner-like finish in minutes, saving you significant time and effort in your daily routine.
            </p>

            <h2 className="text-3xl font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
               <Users className="text-[var(--accent)]" /> Who Should Use An Automatic Ironing Machine?
            </h2>
            <p className="leading-8">
              Busy professionals, families, students, and anyone who hates manual ironing will find it indispensable. It is highly recommended for individuals looking to protect delicate fabrics like silk or wool from iron burns, or those who want to quickly refresh seasonal coats and suits without frequent trips to the local dry cleaner.
            </p>
          </div>
        </div>
      </section>
      {/* ─── 3. GEO模块 (SEO+GEO) 结束 ─── */}

      {/* ─── 4. Why Choose CozeGear 开始 ─── */}
      <section className="bg-[var(--soft)] py-16">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">The CozeGear Standard</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Why Choose CozeGear</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] text-center">
              <div className="mx-auto h-16 w-16 bg-[var(--soft)] rounded-full flex items-center justify-center text-[var(--accent)] mb-6">
                <Zap size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patented Steam Technology</h3>
              <p className="text-[var(--muted)] leading-relaxed">Deep penetration steam matrix that relaxes fibers faster than any handheld steamer on the market.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] text-center">
              <div className="mx-auto h-16 w-16 bg-[var(--soft)] rounded-full flex items-center justify-center text-[var(--accent)] mb-6">
                <ShieldCheck size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Zero Damage Guarantee</h3>
              <p className="text-[var(--muted)] leading-relaxed">Smart thermostatic control ensures your luxury silks and delicate wools are never exposed to burning heat.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] text-center">
              <div className="mx-auto h-16 w-16 bg-[var(--soft)] rounded-full flex items-center justify-center text-[var(--accent)] mb-6">
                <Globe size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Support & Delivery</h3>
              <p className="text-[var(--muted)] leading-relaxed">Fast dispatch from local warehouses. We offer dedicated customer support tailored to your region.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 4. Why Choose CozeGear 结束 ─── */}

      {/* ─── 5. Benefits Grid (6个卖点) 开始 ─── */}
      <section className="bg-white py-16">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Key Benefits</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Transform Your Garment Care</h2>
          </div>
          {/* 完全按照图片1要求的 6 个卖点文案 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <Clock className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-[var(--muted)]">Reclaim your mornings by automating your ironing routine.</p>
            </div>
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <Wand2 className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">No Ironing Skills Required</h3>
              <p className="text-sm text-[var(--muted)]">Perfect results every time, even if you've never used an iron.</p>
            </div>
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <Wind className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Wrinkle Removal</h3>
              <p className="text-sm text-[var(--muted)]">Powerful steam effectively eliminates stubborn creases instantly.</p>
            </div>
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <Sparkles className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Garment Refreshing</h3>
              <p className="text-sm text-[var(--muted)]">Remove daily odors, smoke, and food smells without washing.</p>
            </div>
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <Shield className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Safer Fabric Care</h3>
              <p className="text-sm text-[var(--muted)]">Gentle on all materials, preventing the shine and burns of traditional irons.</p>
            </div>
            <div className="p-6 border border-[var(--line)] rounded-xl hover:shadow-md transition-shadow bg-[var(--soft)]">
              <PlaySquare className="text-[var(--accent)] mb-4" size={36} />
              <h3 className="text-lg font-semibold mb-2">Hands-Free Operation</h3>
              <p className="text-sm text-[var(--muted)]">Just hang it, press start, and walk away to do other tasks.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 5. Benefits Grid 结束 ─── */}

      {/* ─── 6. Who Is It For 开始 ─── */}
      <section className="bg-[var(--foreground)] text-white py-16">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-semibold md:text-4xl">Who Is It For?</h2>
            <p className="mt-4 text-white/80 text-lg">Designed to fit seamlessly into diverse modern lifestyles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Briefcase className="mx-auto text-[var(--accent)] mb-5" size={48} strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-3">Busy Professionals</h3>
              <p className="text-white/70">Keep your suits and business shirts crisp with zero morning hassle.</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto text-[var(--accent)] mb-5" size={48} strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-3">Families</h3>
              <p className="text-white/70">Quickly sanitize and de-wrinkle large loads of children's and everyday clothing.</p>
            </div>
            <div className="text-center">
              <GraduationCap className="mx-auto text-[var(--accent)] mb-5" size={48} strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-3">Students & Renters</h3>
              <p className="text-white/70">Space-saving design perfect for dorms and apartments without room for ironing boards.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 6. Who Is It For 结束 ─── */}

      {/* ─── 7. How It Works 开始 ─── */}
      <section className="bg-white py-16">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Simplicity</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-[var(--line)] -z-10"></div>
            {[
              { step: 1, title: "Hang Garment", desc: "Place your clothes inside the chamber." },
              { step: 2, title: "Add Water", desc: "Fill the easy-access tank with tap water." },
              { step: 3, title: "Select Mode", desc: "Choose your fabric type on the smart panel." },
              { step: 4, title: "Ready to Wear", desc: "Take out your perfectly pressed clothes in minutes." },
            ].map((item) => (
              <div key={item.step} className="bg-white relative z-10 p-2">
                <div className="w-16 h-16 mx-auto bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-[var(--accent)]/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[var(--muted)] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── 7. How It Works 结束 ─── */}

      {/* ─── 8. Before vs Traditional Iron 开始 ─── */}
      <section className="bg-[var(--soft)] py-16 border-y border-[var(--line)]">
        <div className="section-shell">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-semibold md:text-4xl">CozeGear vs Traditional Ironing</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 传统熨斗 */}
            <div className="bg-white rounded-xl p-8 border border-[var(--line)]">
              <h3 className="text-2xl font-semibold text-gray-500 mb-6 border-b border-[var(--line)] pb-4">Traditional Iron</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-[var(--muted)]">
                  <X className="text-red-400 mt-1 shrink-0" size={20} />
                  <span>Manual, labor-intensive process taking 10-15 minutes per shirt.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--muted)]">
                  <X className="text-red-400 mt-1 shrink-0" size={20} />
                  <span>High risk of burning or shining delicate fabrics like silk and wool.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--muted)]">
                  <X className="text-red-400 mt-1 shrink-0" size={20} />
                  <span>Requires bulky ironing boards that take up valuable home space.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--muted)]">
                  <X className="text-red-400 mt-1 shrink-0" size={20} />
                  <span>Cannot effectively sanitize or remove deep odors.</span>
                </li>
              </ul>
            </div>
            {/* CozeGear */}
            <div className="bg-white rounded-xl p-8 border-2 border-[var(--accent)] shadow-lg relative">
              <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-xs px-4 py-1 uppercase tracking-wider rounded-bl-lg font-semibold">Winner</div>
              <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-6 border-b border-[var(--line)] pb-4">CozeGear Automatic</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-[var(--foreground)] font-medium">
                  <Check className="text-[var(--accent)] mt-1 shrink-0" size={20} />
                  <span>100% hands-free. Takes only seconds to set up.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--foreground)] font-medium">
                  <Check className="text-[var(--accent)] mt-1 shrink-0" size={20} />
                  <span>Smart temperature control guarantees zero burns on all fabrics.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--foreground)] font-medium">
                  <Check className="text-[var(--accent)] mt-1 shrink-0" size={20} />
                  <span>Sleek, upright design fits seamlessly into corners or closets.</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--foreground)] font-medium">
                  <Check className="text-[var(--accent)] mt-1 shrink-0" size={20} />
                  <span>Deep steam sanitizes and neutralizes odors instantly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 8. Before vs Traditional Iron 结束 ─── */}

      {/* ─── 9. Technical Specifications 开始 ─── */}
      <section className="py-16 bg-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Specs</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Technical Specifications</h2>
            <p className="mt-4 text-[var(--muted)] text-sm">Engineered for global standards and peak performance.</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="divide-y divide-[var(--line)] text-[var(--muted)]">
                <tr className="bg-[var(--soft)]"><td className="p-4 font-medium text-[var(--foreground)] w-1/3">Rated Power</td><td className="p-4">1200W - 1500W High-Efficiency</td></tr>
                <tr><td className="p-4 font-medium text-[var(--foreground)]">Voltage</td><td className="p-4">AC 110V - 240V (Regional Plug Included)</td></tr>
                <tr className="bg-[var(--soft)]"><td className="p-4 font-medium text-[var(--foreground)]">Water Tank Capacity</td><td className="p-4">850ml Extended Auto-Feed</td></tr>
                <tr><td className="p-4 font-medium text-[var(--foreground)]">Dimensions</td><td className="p-4">60cm x 30cm x 150cm (Deployed)</td></tr>
                <tr className="bg-[var(--soft)]"><td className="p-4 font-medium text-[var(--foreground)]">Certifications</td><td className="p-4">FCC, CE, RoHS Compliant</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* ─── 9. Technical Specifications 结束 ─── */}

      {/* ─── 10. Product Information (WordPress 原生富文本块) 开始 ─── */}
      <section className="py-16 bg-[var(--soft)] border-y border-[var(--line)]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Details</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Product Information</h2>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white p-6 md:p-10 leading-8 text-[var(--muted)] shadow-sm">
            {description ? (
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p>Product details can be edited in WordPress and will appear here.</p>
            )}
          </div>
        </div>
      </section>
      {/* ─── 10. Product Information 结束 ─── */}

      {/* ─── 11. Use Cases 开始 ─── */}
      <section className="py-16 bg-white">
        <div className="section-shell">
           <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-semibold md:text-4xl">Perfect For Every Scenario</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 临时占位图，后期可在 className="object-cover" 的 Image 组件中替换 src */}
            <div className="group relative h-64 rounded-lg overflow-hidden bg-[var(--foreground)] text-white">
              <Image src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400" alt="Morning Rush" fill className="object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold mb-1">The Morning Rush</h3>
                <p className="text-sm text-white/80">Ready your shirt while you drink coffee.</p>
              </div>
            </div>
            <div className="group relative h-64 rounded-lg overflow-hidden bg-[var(--foreground)] text-white">
              <Image src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400" alt="Delicate Silks" fill className="object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold mb-1">Delicate Care</h3>
                <p className="text-sm text-white/80">Safe for expensive silks & wools.</p>
              </div>
            </div>
            <div className="group relative h-64 rounded-lg overflow-hidden bg-[var(--foreground)] text-white">
              <Image src="https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?q=80&w=400" alt="Winter Coats" fill className="object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold mb-1">Seasonal Refresh</h3>
                <p className="text-sm text-white/80">Deodorize heavy winter coats.</p>
              </div>
            </div>
            <div className="group relative h-64 rounded-lg overflow-hidden bg-[var(--foreground)] text-white">
              <Image src="https://images.unsplash.com/photo-1563281983-d2325bb0cbf8?q=80&w=400" alt="Kids Clothes" fill className="object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold mb-1">Baby & Kids</h3>
                <p className="text-sm text-white/80">Sanitize clothes without harsh chemicals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ─── 11. Use Cases 结束 ─── */}

      {/* ─── 12. FAQ 开始 ─── */}
      <section className="bg-[var(--soft)] py-16 border-t border-[var(--line)]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Before you order</h2>
          </div>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white px-8 rounded-xl border">
            {[
              ["Where does checkout happen?", "The current button sends customers to your WordPress WooCommerce cart, so payment stays inside your existing store setup."],
              ["Can this page use more product images later?", "Yes. Add gallery images in WooCommerce and this page can display them automatically."],
              ["Can live chat be added here?", "Yes. A contact entry is already reserved on the frontend, and a live chat provider can be connected later."],
              ["Do I need special installation?", "No. The machine is plug-and-play. Just fill the water tank, plug it into a standard outlet, and it's ready to use."],
            ].map(([question, answer]) => (
              <details className="group py-5" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--foreground)] outline-none">
                  {question}
                  <ChevronDown className="shrink-0 transition group-open:rotate-180 text-[var(--accent)]" size={19} />
                </summary>
                <p className="mt-4 leading-7 text-[var(--muted)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* ─── 12. FAQ 结束 ─── */}

      {/* ─── 13. Reviews 模块 开始 ─── */}
      <section className="bg-white py-16" id="product-reviews">
        <div className="section-shell">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Customer reviews</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Reviews from WordPress</h2>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--soft)] px-5 py-3">
              <div className="flex text-[var(--accent)]" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={18} strokeWidth={1.5} key={index} />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating.toFixed(1)} / 5</span>
              <span className="text-sm text-[var(--muted)] border-l border-[var(--line)] pl-3">{reviewCount} reviews</span>
            </div>
          </div>
          {reviews.length ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {reviews.slice(0, 6).map((review) => (
                <article className="min-h-64 rounded-xl border border-[var(--line)] bg-[var(--background)] p-8 shadow-sm" key={review.id}>
                  <Quote className="text-[var(--soft)] fill-[var(--soft)] mb-2" size={32} />
                  <div className="flex text-[var(--accent)]" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star fill={index < Math.round(rating) ? "currentColor" : "none"} size={16} strokeWidth={1.4} key={index} />
                    ))}
                  </div>
                  <p className="mt-4 line-clamp-6 leading-7 text-[var(--muted)]">{stripHtml(review.content)}</p>
                  <div className="mt-6 border-t border-[var(--line)] pt-4">
                    <p className="font-semibold text-[var(--foreground)]">{review.author?.node?.name || "Verified customer"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)] flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-green-500"/> Verified Purchase
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-10 text-center text-[var(--muted)]">
              Product reviews from WordPress will appear here.
            </div>
          )}
        </div>
      </section>
      {/* ─── 13. Reviews 模块 结束 ─── */}

      {/* ─── 14. Related Products 开始 ─── */}
      {relatedProducts.length ? (
        <section className="py-16 bg-[var(--soft)] border-t border-[var(--line)]">
          <div className="section-shell">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">More products</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">You may also like</h2>
              </div>
              <Link href="/products" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline">
                View all products <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard product={relatedProduct} key={relatedProduct.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {/* ─── 14. Related Products 结束 ─── */}
      
    </SiteShell>
  );
}
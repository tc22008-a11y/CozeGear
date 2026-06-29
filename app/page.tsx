import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Truck,
} from "lucide-react";
import { getHomeProducts, getPosts, getProductImage, getProductRating, stripHtml, type Product, type WordPressPost } from "@/lib/wordpress";
import { BackToTopButton } from "@/components/back-to-top-button";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";

const heroImage =
  "https://jianx144.sg-host.com/wp-content/uploads/2026/05/O1CN01IOjP7C2EukRvuUpAi_2220536698805-0-cib.jpg";

const featureImage =
  "https://jianx144.sg-host.com/wp-content/uploads/2026/05/O1CN019iG4ST2EukSXi2DEm_2220536698805-0-cib.jpg";

const detailImage =
  "https://jianx144.sg-host.com/wp-content/uploads/2026/05/O1CN01epGUet2EukTRyQVpy_2220536698805-0-cib.jpg";

const benefits = [
  { icon: TimerReset, title: "Less time ironing", text: "Designed to simplify daily clothing care at home." },
  { icon: Sparkles, title: "Fresh garment care", text: "Smooth, refresh and care for frequently worn clothes." },
  { icon: ShieldCheck, title: "Simple to operate", text: "A clear setup for everyday use without complicated steps." },
  { icon: Truck, title: "Online ordering", text: "Browse products here and complete checkout securely." },
];

const steps = [
  "Hang the garment inside the machine.",
  "Choose the suitable care mode.",
  "Let the machine refresh and smooth the fabric.",
];

const faqs = [
  {
    question: "What is an automatic ironing machine?",
    answer:
      "An automatic ironing machine is a garment care device designed to reduce manual ironing work by helping smooth and refresh clothes with a more hands-free process.",
  },
  {
    question: "Can it replace a traditional iron?",
    answer:
      "It can reduce routine ironing for many daily garments. Some delicate fabrics, sharp creases or special finishes may still need manual care.",
  },
  {
    question: "Is the homepage connected to WooCommerce?",
    answer:
      "Yes. Product cards on this homepage are loaded from the WordPress WooCommerce store through WooGraphQL.",
  },
  {
    question: "Do customers need an account to buy?",
    answer:
      "The first version is planned for guest shopping. Customers can browse on the Next.js frontend and complete checkout through WordPress.",
  },
  {
    question: "Can the hero image become a video later?",
    answer:
      "Yes. The hero media area is planned so it can be replaced with a product video later without changing the page structure.",
  },
  {
    question: "Where will payment happen?",
    answer:
      "The checkout flow can hand off to the existing WordPress and WooCommerce checkout, with PayPal used first and more payment channels added later.",
  },
];

export default async function Home() {
  const products = await getHomeProducts();
  const posts = await getPosts(3);

  const productSchema = products.map((product) => ({
    "@type": "Product",
    name: product.name,
    image: getProductImage(product) ? [getProductImage(product)] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price?.replace(/[^0-9.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: `https://jianx144.sg-host.com/product/${product.slug}/`,
    },
  }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CozeGear",
      url: "https://jianx144.sg-host.com",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CozeGear",
      url: "https://jianx144.sg-host.com",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Featured automatic ironing machines",
      itemListElement: productSchema.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: product,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <BenefitRow />
      <Products products={products} />
      <WhyUs />
      <HowItWorks />
      <FeatureDetails />
      <MediaSection />
      <Reviews products={products} />
      <FAQ />
      <BlogPreview posts={posts} />
      <BackToTopButton />
    </SiteShell>
  );
}

function Hero() {
  return (

<section className="relative mx-4 my-6 overflow-hidden rounded-lg md:mx-8 lg:mx-auto lg:my-8 lg:max-w-[var(--container-max-width)]">
  {/* 背景视频/图片容器 */}
  <div className="relative h-[520px] w-full sm:h-[560px] lg:h-[640px]">
    {/* ========== 这里替换你的视频/图片 ========== */}
    {/* 方案A：MP4产品演示视频（推荐，自动静音循环播放） */}
    <video
      src="https://jianx144.sg-host.com/wp-content/uploads/2026/06/6-2.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      poster="https://jianx144.sg-host.com/wp-content/uploads/2026/05/export_1-3-2.jpg"
    />

    {/* 方案B：只用静态图片，注释上面video，启用下面Image
    <Image
      src="你的产品大图链接"
      alt="Automatic ironing steamer home scene"
      fill
      sizes="100vw"
      className="object-cover"
    />
    */}

    {/* 深色半透明遮罩，让白色文字可读 */}
    <div className="absolute inset-0 bg-black/35"></div>
  </div>

  {/* 居中文字覆盖层 */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12">
    <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
      Get your time back
    </h1>
    <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
      We'll take care of the tasks you've been putting off so you can get your time back
    </p>

    {/* Shop now 白色圆角按钮 */}
    <Link
      href="/products"
      className="focus-ring mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--soft)] md:h-14 md:px-10 md:text-base"
    >
      Shop now
    </Link>

    {/* 五星评分小字 */}
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white">
      <div className="flex text-green-500">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      <span>TrustScore 4.7 | +500 reviews</span>
    </div>
  </div>
</section>
  );
}

function BenefitRow() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--soft)]">
      <div className="section-shell grid gap-px py-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div className="min-h-36 bg-[var(--soft)] p-5" key={title}>
            <Icon className="mb-4 text-[var(--accent)]" size={24} />
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Products({ products }: { products: Awaited<ReturnType<typeof getHomeProducts>> }) {
  return (
    <section className="bg-white py-18" id="products">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Automatic Ironing Products</p>
            {/* <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Featured automatic ironing products</h2> */}
          </div>
          <Link href="/products" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            View all products <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.length ? (
            products.map((product) => <ProductCard product={product} key={product.id} />)
          ) : (
            <div className="col-span-full rounded border border-[var(--line)] bg-[var(--soft)] p-8 text-[var(--muted)]">
              Products could not be loaded from WooGraphQL.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-18">
      <div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[5/4] overflow-hidden rounded bg-[var(--soft)]">
          <Image src={featureImage} alt="CozeGear automatic ironing steamer product view" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Why CozeGear</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">A cleaner way to think about everyday ironing</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            The first version of this storefront is built around clarity: real WooCommerce products, clear product benefits and a fast frontend designed for future search growth.
          </p>
          <div className="mt-6 grid gap-3">
            {["Built for home garment care", "Connected to your WordPress product catalog", "Prepared for product video and future content"].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2 className="text-[var(--accent)]" size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-[var(--accent-strong)] py-18 text-white">
      <div className="section-shell">
<div className="max-w-none">
  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b9d5ca]">How it works</p>
  <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Simple garment care in 3 steps</h2>
</div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div className="min-h-48 border border-white/15 bg-white/5 p-6" key={step}>
              <span className="text-sm font-semibold text-[#b9d5ca]">0{index + 1}</span>
              <h3 className="mt-5 text-xl font-semibold leading-tight">{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureDetails() {
  return (
    <section className="bg-white py-18">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Product highlights</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Made for people who want faster clothing care</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Use this section to explain the machine, ideal garments, care modes and product details. It is built to support SEO-friendly copy without making the homepage feel crowded.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded bg-[var(--soft)]">
          <Image src={detailImage} alt="Automatic clothes ironing machine detail" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

function MediaSection() {
  return (
    <section className="py-18">
      <div className="section-shell">
        <div className="relative min-h-[420px] overflow-hidden rounded bg-[var(--foreground)] text-white">
          <Image src={heroImage} alt="Automatic ironing machine video preview" fill sizes="100vw" className="object-cover opacity-65" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <button className="focus-ring mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--accent)]" aria-label="Play product video">
              <Play size={26} fill="currentColor" />
            </button>
            <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">Product video ready</h2>
            <p className="mt-4 max-w-xl text-white/85">This image area can become a video module when your product video is ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews({ products }: { products: Product[] }) {
  const productReviews = products
    .flatMap((product) =>
      (product.reviews?.nodes || []).map((review) => ({
        ...review,
        productName: product.name,
        productSlug: product.slug,
      })),
    )
    .slice(0, 3);
  const totalReviews = products.reduce((total, product) => total + getProductRating(product).reviewCount, 0);
  const ratedProducts = products.filter((product) => getProductRating(product).reviewCount > 0);
  const averageRating = ratedProducts.length
    ? ratedProducts.reduce((total, product) => total + getProductRating(product).rating, 0) / ratedProducts.length
    : 0;

  return (
    <section className="bg-white py-18" id="reviews">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Customer reviews</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">What WordPress customers say</h2>
          </div>
          <div className="flex items-center gap-3 rounded border border-[var(--line)] bg-[var(--soft)] px-4 py-3">
            <div className="flex text-[var(--accent)]" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star fill={index < Math.round(averageRating) ? "currentColor" : "none"} size={18} strokeWidth={1.5} key={index} />
              ))}
            </div>
            <span className="text-sm font-semibold">{averageRating.toFixed(1)} / 5</span>
            <span className="text-sm text-[var(--muted)]">{totalReviews} reviews</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {productReviews.length ? productReviews.map((review) => (
            <article className="relative min-h-72 rounded border border-[var(--line)] bg-[var(--background)] p-6" key={review.id}>
              <Quote className="text-[var(--accent)]" size={28} strokeWidth={1.7} />
              <div className="mt-6 flex text-[var(--accent)]" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star fill={index < Math.round(averageRating) ? "currentColor" : "none"} size={16} strokeWidth={1.4} key={index} />
                ))}
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-tight">{review.productName}</h3>
              <p className="mt-4 line-clamp-5 leading-7 text-[var(--muted)]">{stripHtml(review.content)}</p>
              <div className="mt-6 border-t border-[var(--line)] pt-4">
                <p className="font-semibold">{review.author?.node?.name || "Verified customer"}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">WordPress product review</p>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded border border-[var(--line)] bg-[var(--background)] p-8 text-[var(--muted)]">
              Product reviews will appear here after they are added in WordPress.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-white py-18" id="faq">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Automatic ironing machine questions</h2>
        </div>
        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqs.map((faq) => (
            <details className="group py-5" key={faq.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {faq.question}
                <ChevronDown className="shrink-0 transition group-open:rotate-180" size={19} />
              </summary>
              <p className="mt-3 leading-7 text-[var(--muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview({ posts }: { posts: WordPressPost[] }) {
  return (
    <section className="py-18">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Blog</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Garment care guides</h2>
          </div>
          <Link href="/blog" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Read the blog <ArrowRight size={17} />
          </Link>
        </div>
        {posts.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => {
              const image = post.featuredImage?.node;

              return (
                <article className="overflow-hidden rounded border border-[var(--line)] bg-white" key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] bg-[var(--soft)]">
                    {image ? (
                      <Image src={image.sourceUrl} alt={image.altText || post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-[var(--muted)]">WordPress article</div>
                    )}
                  </Link>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {post.date ? new Date(post.date).toLocaleDateString("en-US") : "WordPress article"}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)]">{post.title}</Link>
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{stripHtml(post.excerpt)}</p>
                    <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                      Read article <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded border border-[var(--line)] bg-white p-8 text-[var(--muted)]">
            WordPress posts could not be loaded.
          </div>
        )}
      </div>
    </section>
  );
}

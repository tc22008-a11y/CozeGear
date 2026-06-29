import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { getPostBySlug, getPosts, stripHtml } from "@/lib/wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: post.title,
    description: stripHtml(post.excerpt || post.content),
  };
}

export async function generateStaticParams() {
  const posts = await getPosts(24);
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const image = post.featuredImage?.node;

  return (
    <SiteShell>
      <article>
        <section className="bg-white py-16">
          <div className="section-shell max-w-5xl">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
              <ArrowLeft size={17} /> Back to blog
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">WordPress article</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-[var(--muted)]">
              <span className="inline-flex items-center gap-2"><CalendarDays size={17} /> {post.date ? new Date(post.date).toLocaleDateString("en-US") : "Post"}</span>
              <span className="inline-flex items-center gap-2"><UserRound size={17} /> {post.author?.node?.name || "CozeGear"}</span>
            </div>
          </div>
        </section>

        {image ? (
          <section className="bg-white pb-10">
            <div className="section-shell">
              <div className="relative aspect-[16/7] overflow-hidden rounded bg-[var(--soft)]">
                <Image src={image.sourceUrl} alt={image.altText || post.title} fill priority sizes="100vw" className="object-cover" />
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-14">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.2fr_0.8fr]">
            <aside className="hidden border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--muted)] lg:block">
              {post.categories.nodes[0]?.name || "Article"}
            </aside>
            <div className="rounded border border-[var(--line)] bg-white p-6 md:p-8">
              {post.content ? (
                <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="leading-8 text-[var(--muted)]">Article content can be edited in WordPress.</p>
              )}
            </div>
          </div>
        </section>
      </article>
    </SiteShell>
  );
}

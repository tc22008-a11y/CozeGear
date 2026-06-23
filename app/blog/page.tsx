import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { getPosts, stripHtml } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Blog",
  description: "Garment care guides and automatic ironing machine advice from CozeGear.",
};

export default async function BlogPage() {
  const posts = await getPosts(12);

  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Blog</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Garment care guides</h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            WordPress articles for automatic ironing machines, garment care and product education.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-shell">
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
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                        <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {post.date ? new Date(post.date).toLocaleDateString("en-US") : "Post"}</span>
                        <span className="inline-flex items-center gap-1"><UserRound size={14} /> {post.author?.node?.name || "CozeGear"}</span>
                      </div>
                      <h2 className="text-2xl font-semibold leading-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)]">{post.title}</Link>
                      </h2>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{stripHtml(post.excerpt)}</p>
                      <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
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
    </SiteShell>
  );
}

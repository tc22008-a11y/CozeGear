import { SiteShell } from "@/components/site-shell";
import { getPageByUri } from "@/lib/wordpress";

type ContentPageProps = {
  uri: string;
  eyebrow: string;
  title: string;
  description: string;
  fallback: Array<{ heading: string; body: string }>;
};

function sanitizeWordPressContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[\s\S]*?>/gi, "")
    .replace(/<meta[\s\S]*?>/gi, "");
}

export async function ContentPage({ uri, eyebrow, title, description, fallback }: ContentPageProps) {
  const page = await getPageByUri(uri);
  const pageContent = page?.content ? sanitizeWordPressContent(page.content) : null;

  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{page?.title || title}</h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">{description}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="hidden border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--muted)] lg:block">
            Content managed from WordPress
          </aside>
          <article className="rounded border border-[var(--line)] bg-white p-6 md:p-8">
            {pageContent ? (
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: pageContent }} />
            ) : (
              <div className="grid gap-7">
                {fallback.map((section) => (
                  <section key={section.heading}>
                    <h2 className="text-2xl font-semibold">{section.heading}</h2>
                    <p className="mt-3 leading-8 text-[var(--muted)]">{section.body}</p>
                  </section>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}

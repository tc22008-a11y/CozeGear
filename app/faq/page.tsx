import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about automatic ironing machines and CozeGear ordering.",
};

const faqs = [
  ["What is an automatic ironing machine?", "It is a garment care device designed to reduce routine manual ironing by helping smooth and refresh clothes with a more hands-free process."],
  ["Where does checkout happen?", "Checkout currently hands off to the existing WordPress WooCommerce store, so payment and order handling stay inside your current backend."],
  ["Are products loaded from WordPress?", "Yes. Product names, prices, descriptions and images are loaded through the WordPress GraphQL interface."],
  ["Can this site support multiple languages later?", "Yes. The frontend can be adapted for multilingual routes, and WordPress product/page content can be translated with a compatible translation setup."],
  ["Can live chat be added later?", "Yes. A customer service entry is already reserved in the frontend and can later connect to a live chat provider."],
];

export default function FAQPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Frequently asked questions</h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Key questions for product browsing, checkout, WordPress content and future store features.
          </p>
        </div>
      </section>
      <section className="py-14">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="hidden border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--muted)] lg:block">
            CozeGear support
          </aside>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white">
            {faqs.map(([question, answer]) => (
              <details className="group px-6 py-5" key={question}>
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
    </SiteShell>
  );
}

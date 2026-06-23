import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact CozeGear for product questions, order support and customer service.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Contact us</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">We are here to help</h1>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Use this page for customer questions before and after purchase. A live chat provider can be connected later without changing the page structure.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid gap-4">
            {[
              { icon: MessageCircle, title: "Live chat ready", text: "The frontend already has a reserved customer service entry." },
              { icon: Mail, title: "Email support", text: "Add your official support email here when ready." },
              { icon: ShieldCheck, title: "Order support", text: "WooCommerce will remain the order backend for the first version." },
            ].map(({ icon: Icon, title, text }) => (
              <div className="rounded border border-[var(--line)] bg-white p-5" key={title}>
                <Icon className="mb-4 text-[var(--accent)]" size={24} />
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 leading-7 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>

          <form className="rounded border border-[var(--line)] bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Name
                <input className="h-12 rounded border border-[var(--line)] bg-white px-4 font-normal outline-none focus:border-[var(--accent)]" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input className="h-12 rounded border border-[var(--line)] bg-white px-4 font-normal outline-none focus:border-[var(--accent)]" placeholder="you@example.com" type="email" />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold">
              Message
              <textarea className="min-h-40 rounded border border-[var(--line)] bg-white p-4 font-normal outline-none focus:border-[var(--accent)]" placeholder="Tell us what you need help with" />
            </label>
            <button className="focus-ring mt-6 inline-flex h-12 items-center justify-center gap-2 rounded bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]" type="button">
              Send message <ArrowRight size={18} />
            </button>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              This form is a frontend placeholder. It can later connect to WordPress, email, or a customer service platform.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Shopping help</p>
            <h2 className="mt-3 text-3xl font-semibold">Browse products before contacting us</h2>
          </div>
          <Link href="/products" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded bg-[var(--foreground)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent)]">
            View products <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

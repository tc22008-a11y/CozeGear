"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, ShoppingBag } from "lucide-react";

export function ProductStickyActions({ buyUrl }: { buyUrl: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("product-buy-actions");

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && window.scrollY > 360);
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-50 inline-flex w-auto max-w-[calc(100%-32px)] -translate-x-1/2 gap-2 rounded-full border border-[var(--line)] bg-white p-2 shadow-lg transition duration-200 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Link href={buyUrl} className="focus-ring inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]">
        <ShoppingBag size={18} />
        Buy now
      </Link>
      <button
        className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[var(--soft)]"
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}

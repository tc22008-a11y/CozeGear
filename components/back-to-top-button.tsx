"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 520);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      className={`focus-ring fixed bottom-20 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--foreground)] shadow-lg transition hover:bg-[var(--soft)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      } ${className}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

'use client'; // 新增客户端标识，必须放第一行
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 新增路由监听
import { useState, useEffect } from "react"; // 新增状态、副作用
import { Globe2, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

export const supportItems = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Contact", href: "/contact-us" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-[var(--accent-strong)] px-4 py-2 text-center text-sm font-medium text-white">
      Smart garment care for modern homes
    </div>
  );
}

export function Header() {
  // 新增菜单开关状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 路由切换自动关闭菜单
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,251,248,0.92)] backdrop-blur">
      <div className="section-shell flex h-18 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-2 font-bold tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded bg-[var(--accent)] text-white">C</span>
          <span>CozeGear</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--muted)] lg:flex">
          {navItems.map((item) => (
            <Link className="focus-ring hover:text-[var(--foreground)]" href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="relative flex items-center gap-2">
          <button className="focus-ring hidden h-10 w-10 place-items-center rounded border border-[var(--line)] text-[var(--muted)] md:grid" aria-label="Language selector">
            <Globe2 size={19} />
          </button>
          <Link href="/products" className="focus-ring grid h-10 w-10 place-items-center rounded border border-[var(--line)] text-[var(--muted)]" aria-label="Products">
            <ShoppingBag size={19} />
          </Link>

          {/* 替换原来的details，改用受控按钮+状态控制弹窗 */}
          <div className="lg:hidden">
            <button
              className="focus-ring grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-[var(--line)] text-[var(--muted)]"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {/* 菜单弹窗，仅打开时渲染 */}
            {mobileMenuOpen && (
              <div id="mobile-navigation" className="fixed left-0 right-0 top-[104px] z-50 border-t border-[var(--line)] bg-white shadow-lg">
                <nav className="section-shell grid py-3 text-sm font-semibold text-[var(--muted)]">
                  {navItems.map((item) => (
                    <Link
                      className="focus-ring border-b border-[var(--line)] py-4 last:border-b-0 hover:text-[var(--foreground)]"
                      href={item.href}
                      key={item.label}
                      // 点击导航链接强制关闭菜单
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white py-10">
      <div className="section-shell grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="mb-3 flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded bg-[var(--accent)] text-white">C</span>
            <span>CozeGear</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
            Automatic ironing machines and garment care products for simpler daily routines.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Navigation</h3>
          <div className="grid gap-2 text-sm text-[var(--muted)]">
            {navItems.map((item) => (
              <Link className="hover:text-[var(--foreground)]" href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Support</h3>
          <div className="grid gap-2 text-sm text-[var(--muted)]">
            {supportItems.map((item) => (
              <Link className="hover:text-[var(--foreground)]" href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LiveChatEntry() {
  const href = process.env.NEXT_PUBLIC_LIVE_CHAT_URL || "/contact-us";

  return (
    <Link
      href={href}
      className="focus-ring fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-lg hover:bg-[var(--accent-strong)]"
      aria-label="Contact customer service"
    >
      <MessageCircle size={19} />
      <span className="hidden sm:inline">Contact</span>
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
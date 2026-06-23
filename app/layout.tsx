import type { Metadata } from "next";
import { AnnouncementBar, Footer, Header, LiveChatEntry } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jianx144.sg-host.com"),
  title: {
    default: "CozeGear | Automatic Ironing Machines",
    template: "%s | CozeGear",
  },
  description:
    "Shop automatic ironing machines and smart garment care products from CozeGear. Built for simpler, faster clothing care at home.",
  openGraph: {
    title: "CozeGear | Automatic Ironing Machines",
    description:
      "Automatic ironing machines and garment care products for easier daily clothing care.",
    type: "website",
    siteName: "CozeGear",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <LiveChatEntry />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about CozeGear and our focus on simple home garment care.",
};

export default function AboutPage() {
  return (
    <ContentPage
      uri="/about-us/"
      eyebrow="About us"
      title="Making everyday garment care easier"
      description="CozeGear is built around practical home garment care products, clear product information and a faster shopping experience."
      fallback={[
        {
          heading: "Who we are",
          body: "CozeGear focuses on automatic ironing machines and smart garment care products for people who want easier daily routines at home.",
        },
        {
          heading: "What we care about",
          body: "We want product pages to be clear, trustworthy and easy to use, with product information connected to the WordPress store you already manage.",
        },
      ]}
    />
  );
}

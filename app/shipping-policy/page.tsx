import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <ContentPage
      uri="/shipping-policy/"
      eyebrow="Policy"
      title="Shipping Policy"
      description="Shipping information for CozeGear orders."
      fallback={[{ heading: "Shipping Policy", body: "Add your official shipping policy in WordPress and it will appear here." }]}
    />
  );
}

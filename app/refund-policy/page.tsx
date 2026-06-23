import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <ContentPage
      uri="/refund-policy/"
      eyebrow="Policy"
      title="Refund Policy"
      description="Refund and return information for CozeGear orders."
      fallback={[{ heading: "Refund Policy", body: "Add your official refund policy in WordPress and it will appear here." }]}
    />
  );
}

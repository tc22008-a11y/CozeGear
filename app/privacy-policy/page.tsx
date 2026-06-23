import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      uri="/privacy-policy/"
      eyebrow="Policy"
      title="Privacy Policy"
      description="Privacy information for customers using the CozeGear storefront."
      fallback={[{ heading: "Privacy Policy", body: "Add your official privacy policy in WordPress and it will appear here." }]}
    />
  );
}

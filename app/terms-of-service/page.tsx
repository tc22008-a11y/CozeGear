import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <ContentPage
      uri="/terms-of-service/"
      eyebrow="Policy"
      title="Terms of Service"
      description="Terms and conditions for using the CozeGear storefront."
      fallback={[{ heading: "Terms of Service", body: "Add your official terms of service in WordPress and it will appear here." }]}
    />
  );
}

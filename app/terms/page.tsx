// Server Component
import TermsClient from "./TermsClient";
import { redirect } from "next/navigation";

export default function TermsPage() {
  const handleAccept = async (consents: {
    termsConsent: boolean;
    profileShareConsent: boolean;
  }) => {
    "use server";
    // Handle the consents, e.g., save to database
    redirect("/onboarding");
  };

  return <TermsClient onAccept={handleAccept} />;
}

// Server Component
import TermsClient from "./TermsClient";
import { redirect } from "next/navigation";

export default function TermsPage() {
  const handleAccept = async (consents: {
    termsConsent: boolean;
    profileShareConsent: boolean;
  }) => {
    "use server";
    // Save consents to database
    console.log("Saving consents:", consents); // Temporary usage until DB implementation
    redirect("/onboarding");
  };

  return <TermsClient onAccept={handleAccept} />;
}

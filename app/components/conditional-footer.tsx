"use client";

import { usePathname } from "next/navigation";
import Footer from "components/ui/footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/profile");

  if (isProfilePage) {
    return null;
  }

  return <Footer />;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBreadcrumb() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 py-4">
      <Link href="/providers" className="text-gray-600 hover:text-gray-900">
        Providers
      </Link>
      <span className="text-gray-600">/</span>
      <span className="text-gray-900">
        {pathname === "/providers/register" ? "Register" : ""}
      </span>
    </nav>
  );
}

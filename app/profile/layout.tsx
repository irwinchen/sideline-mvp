// app/profile/layout.tsx
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "components/ui/button";
import { Edit } from "lucide-react";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth();
  const isAuthenticated = !!authData.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {isAuthenticated && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12",
                    },
                  }}
                />
                <div className="text-lg font-semibold text-gray-800 ml-6">
                  My Profile
                </div>
              </div>
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

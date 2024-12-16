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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {" "}
      {/* Account for main nav */}
      {isAuthenticated && (
        <div className="flex-none bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
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
        </div>
      )}
      <div className="flex-1 min-h-0">
        {" "}
        {/* Enable scrolling in children */}
        {children}
      </div>
    </div>
  );
}

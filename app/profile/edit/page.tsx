// app/profile/edit/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function EditProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="container max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile edit form will go here */}
            <p>Profile editing functionality coming soon...</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

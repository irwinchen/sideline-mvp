import { SignUp } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Sideline",
  description:
    "Create your Sideline profile to share your dietary requirements safely and easily.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Your Profile
          </h1>
          <p className="text-muted-foreground">
            Join Sideline to communicate your dietary needs effectively
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm p-0 border-0">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-6",
                headerTitle: "text-slate-900 font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors",
                formFieldInput:
                  "rounded-lg border-input focus:border-primary focus:ring-primary",
                footerAction: "text-muted-foreground",
                footerActionLink: "text-primary hover:text-primary/90",
                form: "gap-6",
                formField: "gap-2",
              },
            }}
            redirectUrl="/onboarding"
          />
        </Card>
      </div>
    </main>
  );
}

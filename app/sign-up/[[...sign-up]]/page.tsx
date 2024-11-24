import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Sideline",
  description:
    "Create your Sideline profile to share your dietary requirements safely and easily.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Create Your Profile
            </h1>
            <p className="text-slate-600">
              Join Sideline to communicate your dietary needs effectively
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-slate-800 font-bold",
                  headerSubtitle: "text-slate-600",
                  formButtonPrimary:
                    "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
                  formFieldInput:
                    "rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500",
                  footerAction: "text-slate-600",
                  footerActionLink: "text-indigo-600 hover:text-indigo-700",
                },
              }}
              redirectUrl="/onboarding"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

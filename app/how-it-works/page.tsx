import { Check } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-primary">How Sideline Works</h1>

        <div className="space-y-12">
          <Step
            number="1"
            title="Create Your Profile"
            description="Input your dietary requirements, allergies, and preferences in your profile."
          />

          <Step
            number="2"
            title="Get Your QR Code"
            description="Receive a unique QR code that links to your dietary profile."
          />

          <Step
            number="3"
            title="Share Anywhere"
            description="Show your QR code to restaurant staff or share your profile link with hosts."
          />

          <Step
            number="4"
            title="Automatic Translation"
            description="Your requirements are instantly translated into the local language."
          />
        </div>
      </div>
    </main>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        {number}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

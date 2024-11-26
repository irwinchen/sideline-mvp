import Link from "next/link";
import { QrCode, Globe, Shield, Share2 } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container space-y-16 text-center">
        {/* Brand Title */}
        <h1 className="text-5xl font-bold text-primary">Sideline</h1>

        {/* Hero Section */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Communicate Your Food Needs,{" "}
            <span className="text-primary">Anywhere, Anytime</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Share your dietary requirements instantly with restaurants and hosts
            - in their language, with confidence that they understand.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Create Your Profile</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <FeatureCard
            icon={<QrCode className="h-8 w-8 text-primary" />}
            title="Instant Sharing"
            description="Show your QR code or share your link - no app needed"
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-primary" />}
            title="Any Language"
            description="Automatically translates for kitchen staff worldwide"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary" />}
            title="Privacy First"
            description="Your health information stays private and secure"
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-primary" />}
            title="Easy Access"
            description="Saves to your digital wallet for quick access"
          />
        </div>

        {/* Testimonial */}
        <Card className="mx-auto max-w-2xl p-8">
          <blockquote className="space-y-4">
            <p className="text-muted-foreground italic">
              &quot;Finally, I can travel and dine out without anxiety about my
              food allergies.&quot;
            </p>
            <footer className="space-y-1">
              <p className="font-semibold">Sarah M.</p>
              <p className="text-sm text-muted-foreground">Sideline Member</p>
            </footer>
          </blockquote>
        </Card>

        {/* CTA Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary">
            Ready to Make Dining Safer?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of members who dine with confidence.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

import Link from "next/link";
import { QrCode, Globe, Shield, Share2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-16">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Hero Section */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Communicate Your Food Needs,{" "}
          <span className="text-indigo-600">Anywhere, Anytime</span>
        </h1>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          Share your dietary requirements instantly with restaurants and hosts -
          in their language, with confidence that they understand.
        </p>
        <Link
          href="/sign-up"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Your Profile
        </Link>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <FeatureCard
            icon={<QrCode className="w-8 h-8 text-indigo-600" />}
            title="Instant Sharing"
            description="Show your QR code or share your link - no app needed"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-indigo-600" />}
            title="Any Language"
            description="Automatically translates for kitchen staff worldwide"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-indigo-600" />}
            title="Privacy First"
            description="Your health information stays private and secure"
          />
          <FeatureCard
            icon={<Share2 className="w-8 h-8 text-indigo-600" />}
            title="Easy Access"
            description="Saves to your digital wallet for quick access"
          />
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-lg p-8 mt-16 shadow-sm">
          <p className="text-slate-700 italic">
            "Finally, I can travel and dine out without anxiety about my food
            allergies."
          </p>
          <div className="mt-4">
            <p className="font-semibold text-slate-900">Sarah M.</p>
            <p className="text-slate-600 text-sm">Sideline Member</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">
            Ready to Make Dining Safer?
          </h2>
          <p className="text-slate-600 mb-8">
            Join thousands of members who dine with confidence.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  );
}

// Feature Card Component
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
};

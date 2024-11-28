import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Providers | Sideline",
  description:
    "Partner with Sideline to better serve your customers' food needs",
};

export default function ProvidersPage() {
  return (
    <main className="container mx-auto px-4 py-24 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">Partner with Sideline</h1>
      <p className="text-xl text-gray-600 mb-12">
        Join us in transforming how you anticipate and exceed customer
        expectations. Sideline empowers you to delight your customers with
        personalized service while streamlining your operations for maximum
        efficiency.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Anticipate special dietary needs before guests arrive</li>
            <li>• Customize menus to delight every customer</li>
            <li>• Reduce wait times with better preparation</li>
            <li>• Optimize inventory based on customer preferences</li>
            <li>• Turn dietary restrictions into opportunities</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Hotels</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Create memorable dining experiences</li>
            <li>• Personalize room service recommendations</li>
            <li>• Anticipate guest needs before check-in</li>
            <li>• Streamline kitchen operations</li>
            <li>• Enhance guest satisfaction scores</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Perfect wedding menu planning</li>
            <li>• Seamless dietary accommodation</li>
            <li>• Smart catering preparation</li>
            <li>• Special request management</li>
            <li>• Efficient event staff coordination</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Food Service Providers
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Proactive demand forecasting</li>
            <li>• Streamlined inventory management</li>
            <li>• Automated dietary tracking</li>
            <li>• Cost-effective planning</li>
            <li>• Enhanced customer satisfaction</li>
          </ul>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl font-semibold mb-4">
          Ready to elevate your customer experience?
        </p>
        <p className="text-gray-600">
          Join Sideline today and transform how you anticipate, plan, and
          deliver exceptional dining experiences while optimizing your
          operations.
        </p>
      </div>
    </main>
  );
}

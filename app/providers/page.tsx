import { Metadata } from "next";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Providers | Sideline",
  description:
    "Partner with Sideline to better serve your customers' food needs",
};

export default function ProvidersPage() {
  return (
    <main className="container mx-auto px-4 py-24 max-w-7xl">
      {/* New Event Planning Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Planning a dinner party or an event?
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          Make your event planning easier by collecting your guests' dietary
          restrictions and food allergies in one place. Create a custom link to
          share with your guests and get organized before the big day.
        </p>
        <Link href="/providers/events/create">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Create Event Link
          </Button>
        </Link>
      </div>

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
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Hotels</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Create memorable dining experiences</li>
            <li>• Personalize room service recommendations</li>
            <li>• Anticipate guest needs before check-in</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Perfect wedding menu planning</li>
            <li>• Seamless dietary accommodation</li>
            <li>• Smart catering preparation</li>
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
          </ul>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl font-semibold mb-4">
          Ready to elevate your customer experience?
        </p>
        <p className="text-gray-600 mb-8">
          Join Sideline today and transform how you anticipate, plan, and
          deliver exceptional dining experiences while optimizing your
          operations.
        </p>
        <Link href="/providers/register">
          <Button size="lg" className="px-8">
            Register as Provider
          </Button>
        </Link>
      </div>
    </main>
  );
}

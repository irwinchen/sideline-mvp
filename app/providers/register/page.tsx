"use client";

import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { useState } from "react";

export default function ProviderRegistrationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    providerType: "",
    organizationSize: "",
    anticipatedAccess: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Provider Registration</h1>
      <p className="text-xl text-gray-600 mb-12">
        Complete this form to begin your partnership with Sideline and transform
        how you serve your customers.
      </p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="providerType">Type of Provider</Label>
              <select
                id="providerType"
                name="providerType"
                value={formData.providerType}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select provider type</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="event">Event</option>
                <option value="foodService">Food Service Provider</option>
              </select>
            </div>

            <div>
              <Label htmlFor="organizationSize">Size of Organization</Label>
              <select
                id="organizationSize"
                name="organizationSize"
                value={formData.organizationSize}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select size</option>
                <option value="small">Small (1-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201+ employees)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="anticipatedAccess">
                Anticipated Profile Access per Month
              </Label>
              <select
                id="anticipatedAccess"
                name="anticipatedAccess"
                value={formData.anticipatedAccess}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select anticipated access</option>
                <option value="0-100">0-100</option>
                <option value="101-500">101-500</option>
                <option value="501-1000">501-1,000</option>
                <option value="1000+">1,000+</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Registration
          </Button>
        </form>
      </Card>
    </main>
  );
}

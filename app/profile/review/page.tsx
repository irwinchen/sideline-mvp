"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import RestrictionsChecklist from "components/ui/restrictions-checklist";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

export default function ReviewPage() {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);

  useEffect(() => {
    // Load restrictions from localStorage on mount
    const savedRestrictions = localStorage.getItem("onboardingRestrictions");
    if (savedRestrictions) {
      try {
        const parsed = JSON.parse(savedRestrictions);
        setRestrictions(parsed);
        // Clear the localStorage after loading to prevent stale data
        localStorage.removeItem("onboardingRestrictions");
      } catch (err) {
        console.error("Error parsing restrictions:", err);
        setError("Error loading dietary restrictions");
      }
    }
  }, []);

  const handleRemoveRestriction = (item: string) => {
    setRestrictions(restrictions.filter((r) => r.item !== item));
  };

  const handleToggleType = (item: string) => {
    setRestrictions(
      restrictions.map((r) => {
        if (r.item === item) {
          return {
            ...r,
            type: r.type === "cannot" ? "willnot" : "cannot",
          };
        }
        return r;
      })
    );
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restrictions,
          approved: true,
          approvedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      if (data.success) {
        setIsApproved(true);
      } else {
        throw new Error(data.error || "Failed to save profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/onboarding");
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  // Generate the profile URL - in production this would be your actual domain
  const profileUrl = `${window.location.origin}/profile`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Review Your Profile</h1>
          {isApproved ? (
            <Button onClick={handleEdit}>Edit Profile</Button>
          ) : (
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onClick={handleApprove} disabled={isLoading}>
                {isLoading ? "Saving..." : "Approve"}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <RestrictionsChecklist
              restrictions={restrictions}
              onRemoveRestriction={
                !isApproved ? handleRemoveRestriction : undefined
              }
              onToggleType={!isApproved ? handleToggleType : undefined}
              readonly={isApproved}
            />
          </Card>

          <Card className="p-6">
            <DietarySummaryCard
              restrictions={restrictions}
              readonly={isApproved}
            />
          </Card>
        </div>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Your Profile QR Code</h2>
            <p className="text-sm text-gray-600">
              Share this QR code with restaurants and providers to quickly
              access your dietary profile
            </p>
            <div className="flex justify-center p-4">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

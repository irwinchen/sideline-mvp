"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DietarySummaryCard from "@/components/ui/dietary-summary-card";
import RestrictionsChecklist from "@/components/ui/restrictions-checklist";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [restrictions, setRestrictions] = useState([
    { item: "peanuts", type: "cannot" as const },
    { item: "shellfish", type: "willnot" as const },
  ]);

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

  const handleSave = async () => {
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
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      if (data.success) {
        router.push("/profile/review");
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

  const handleCancel = () => {
    router.push("/profile/review");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
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
            onRemoveRestriction={handleRemoveRestriction}
            onToggleType={handleToggleType}
          />
        </Card>

        <Card className="p-6">
          <DietarySummaryCard restrictions={restrictions} />
        </Card>
      </div>
    </div>
  );
}

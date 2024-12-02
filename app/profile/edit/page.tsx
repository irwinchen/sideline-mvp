"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import ChatInterface from "components/ui/chat-interface";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [restrictions, setRestrictions] = useState([
    { item: "peanuts", type: "cannot" as const },
    { item: "shellfish", type: "willnot" as const },
  ]);

  const handleUpdateRestrictions = (
    newRestrictions: { item: string; type: "cannot" | "willnot" }[]
  ) => {
    setRestrictions((prev) => {
      const updatedRestrictions = [...prev];

      newRestrictions.forEach((newItem) => {
        const existingIndex = updatedRestrictions.findIndex(
          (item) => item.item === newItem.item
        );

        if (existingIndex === -1) {
          updatedRestrictions.push(newItem);
        }
      });

      return updatedRestrictions;
    });
  };

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

      // Store restrictions in localStorage before navigating
      localStorage.setItem(
        "onboardingRestrictions",
        JSON.stringify(restrictions)
      );

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
    <div className="max-w-6xl mx-auto space-y-8 p-4">
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

      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ height: "600px" }}
      >
        <div className="grid grid-cols-[1fr,400px] h-full">
          <ChatInterface onUpdateRestrictions={handleUpdateRestrictions} />
          <div className="grid grid-rows-2 h-full">
            <div className="h-[300px]">
              <RestrictionsChecklist
                restrictions={restrictions}
                onRemoveRestriction={handleRemoveRestriction}
                onToggleType={handleToggleType}
              />
            </div>
            <div className="h-[300px]">
              <DietarySummaryCard restrictions={restrictions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

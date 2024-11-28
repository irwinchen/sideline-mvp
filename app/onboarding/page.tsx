"use client";

import { useState } from "react";
import ProgressSteps from "components/ui/progress-steps";
import ChatInterface from "components/ui/chat-interface";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import { Button } from "components/ui/button";

const onboardingSteps = [
  { id: 1, label: "Create Account", completed: true },
  { id: 2, label: "Dietary Profile", current: true },
  { id: 3, label: "Preferences" },
  { id: 4, label: "Review" },
];

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

export default function OnboardingPage() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);

  const handleUpdateRestrictions = (newRestrictions: Restriction[]) => {
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

  const handleRemoveRestriction = (itemToRemove: string) => {
    setRestrictions((prev) =>
      prev.filter((item) => item.item !== itemToRemove)
    );
  };

  const handleToggleType = (itemToToggle: string) => {
    setRestrictions((prev) =>
      prev.map((item) =>
        item.item === itemToToggle
          ? { ...item, type: item.type === "cannot" ? "willnot" : "cannot" }
          : item
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <ProgressSteps steps={onboardingSteps} currentStep={2} />

      <div className="flex-1 container mx-auto py-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s create your dietary profile through a simple conversation
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ height: "80vh" }}
        >
          <div className="grid grid-cols-2 h-full">
            <ChatInterface onUpdateRestrictions={handleUpdateRestrictions} />
            <RestrictionsChecklist
              restrictions={restrictions}
              onRemoveRestriction={handleRemoveRestriction}
              onToggleType={handleToggleType}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="outline">Back</Button>
          <Button>Continue to Preferences</Button>
        </div>
      </div>
    </main>
  );
}

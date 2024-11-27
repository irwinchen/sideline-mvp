"use client";

import { useState } from "react";
import ProgressSteps from "components/ui/progress-steps";
import ChatInterface from "components/ui/chat-interface";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import { Button } from "components/ui/button";

export default function TestPage() {
  const testSteps = [
    { id: 1, label: "Step 1", completed: true },
    { id: 2, label: "Step 2", current: true },
    { id: 3, label: "Step 3" },
    { id: 4, label: "Step 4" },
  ];

  const [restrictions, setRestrictions] = useState<
    {
      item: string;
      type: "cannot" | "willnot";
    }[]
  >([]);

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
      <div className="py-8">
        <ProgressSteps steps={testSteps} currentStep={2} />
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-4 text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s create your dietary profile through a simple conversation
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ height: "calc(100vh - 400px)", minHeight: "500px" }}
        >
          <div className="grid grid-cols-2 h-full divide-x">
            <div className="flex flex-col h-full">
              <ChatInterface onUpdateRestrictions={handleUpdateRestrictions} />
            </div>
            <div className="flex flex-col h-full">
              <RestrictionsChecklist
                restrictions={restrictions}
                onRemoveRestriction={handleRemoveRestriction}
                onToggleType={handleToggleType}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-4">
          <Button variant="outline">Back</Button>
          <Button>Continue to Preferences</Button>
        </div>
      </div>
    </main>
  );
}

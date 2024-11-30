"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ProgressSteps from "components/ui/progress-steps";
import ChatInterface from "components/ui/chat-interface";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import { Button } from "components/ui/button";

const onboardingSteps = [
  { id: 1, label: "Create Account", completed: true },
  { id: 2, label: "Dietary Profile", current: true },
  { id: 3, label: "Review" },
];

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

export default function OnboardingPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push("/");
        return;
      }

      // Check if user has completed profile (this is a placeholder - implement your actual profile check)
      const checkProfile = async () => {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();
          if (data.completed) {
            router.push("/profile");
          }
          setHasProfile(!!data.exists);
        } catch (error) {
          console.error("Error checking profile:", error);
        }
      };

      checkProfile();
    }
  }, [isLoaded, isSignedIn, router]);

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

  const handleContinueToReview = () => {
    // Store restrictions in localStorage before navigation
    localStorage.setItem(
      "onboardingRestrictions",
      JSON.stringify(restrictions)
    );
    router.push("/profile/review");
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      <ProgressSteps steps={onboardingSteps} currentStep={2} />

      <div className="flex-1 container mx-auto py-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {hasProfile
              ? "Welcome back! Please finish setting up your profile"
              : "Set Up Your Profile"}
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s create your dietary profile through a simple conversation
          </p>
        </div>

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

        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="outline">Back</Button>
          <Button onClick={handleContinueToReview}>Continue to Review</Button>
        </div>
      </div>
    </main>
  );
}

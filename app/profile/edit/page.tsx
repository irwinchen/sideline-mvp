"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import ChatInterface from "components/ui/chat-interface";

type Language = "en" | "es" | "zh" | "ja";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
] as const;

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [restrictions, setRestrictions] = useState([
    { item: "peanuts", type: "cannot" as const },
    { item: "shellfish", type: "willnot" as const },
  ]);

  const handleUpdateRestrictions = useCallback(
    (newRestrictions: { item: string; type: "cannot" | "willnot" }[]) => {
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
    },
    []
  );

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
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

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
          firstName,
          lastName,
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

  // Use user's ID as profile ID
  const profileId = user?.id || "default-profile";

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2"
            >
              First Name
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
      </Card>

      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ height: "600px" }}
      >
        <div className="grid grid-cols-[1fr,400px] h-full">
          <ChatInterface
            profileId={profileId}
            onUpdateRestrictions={handleUpdateRestrictions}
          />
          <div className="grid grid-rows-2 h-full">
            <div className="h-[300px]">
              <RestrictionsChecklist
                restrictions={restrictions}
                onRemoveRestriction={handleRemoveRestriction}
                onToggleType={handleToggleType}
                language={language}
              />
            </div>
            <div className="h-[300px]">
              <DietarySummaryCard
                restrictions={restrictions}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

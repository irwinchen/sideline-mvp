"use client";

import { withErrorBoundary } from "@/components/error-boundary";
import ChatInterface from "@/components/ui/chat-interface";
import { RestrictionsSummary } from "@/components/ui/restrictions-summary";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { Restriction } from "@/lib/client/storage-service";
import { storageService } from "@/lib/client/storage-service";

function ProfileClient() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  // Generate a stable profile ID for the current user
  // In MVP we'll use a fixed ID, but this should be replaced with actual user ID later
  const profileId = "demo-user";

  // Load existing profile data on mount
  useEffect(() => {
    const profile = storageService.getProfile(profileId);
    if (profile) {
      setRestrictions(profile.restrictions);
    } else {
      const newProfile = storageService.createProfile(profileId);
      setRestrictions(newProfile.restrictions);
    }
  }, []);

  const handleUpdateRestrictions = (newRestrictions: Restriction[]) => {
    setRestrictions(newRestrictions);
    // Ensure the profile is updated in storage
    const profile = storageService.getProfile(profileId);
    if (profile) {
      storageService.updateProfile(profileId, newRestrictions);
    } else {
      storageService.createProfile(profileId, newRestrictions);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Dietary Profile</h1>

      <div className="grid gap-8 md:grid-cols-[1fr,400px]">
        {/* Main Chat Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Chat About Your Dietary Needs
          </h2>
          <ChatInterface
            profileId={profileId}
            onUpdateRestrictions={handleUpdateRestrictions}
          />
        </Card>

        {/* Restrictions Summary Section */}
        <div className="space-y-6">
          <RestrictionsSummary
            restrictions={restrictions}
            onUpdateRestrictions={handleUpdateRestrictions}
          />

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Tell me about any allergies or dietary restrictions</li>
              <li>• Mention if something makes you sick</li>
              <li>• Include any religious or cultural dietary needs</li>
              <li>• Share your food preferences</li>
              <li>• You can edit your restrictions anytime</li>
            </ul>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Understanding Confidence Levels
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>
                <span className="font-medium">High:</span> Medical conditions,
                explicit allergies
              </li>
              <li>
                <span className="font-medium">Medium:</span> Clear dietary
                restrictions
              </li>
              <li>
                <span className="font-medium">Low:</span> Preferences or unclear
                mentions
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Wrap with error boundary
export default withErrorBoundary(ProfileClient);

"use client";

import { withErrorBoundary } from "components/error-boundary";
import ChatInterface from "components/ui/chat-interface";
import { RestrictionsSummary } from "components/ui/restrictions-summary";
import { useState, useEffect } from "react";
import type { Restriction } from "lib/client/storage-service";
import { storageService } from "lib/client/storage-service";

function ProfileClient() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const profileId = "demo-user";

  useEffect(() => {
    // Initialize profile and restrictions
    const initializeProfile = () => {
      const profile = storageService.getProfile(profileId);
      if (profile) {
        setRestrictions(profile.restrictions);
      } else {
        const newProfile = storageService.createProfile(profileId);
        setRestrictions(newProfile.restrictions);
      }
      setIsLoading(false);
    };

    initializeProfile();
  }, []);

  const handleUpdateRestrictions = (newRestrictions: Restriction[]) => {
    setRestrictions(newRestrictions);
    // Update storage after state is set
    const profile = storageService.getProfile(profileId);
    if (profile) {
      storageService.updateProfile(profileId, newRestrictions);
    } else {
      storageService.createProfile(profileId, newRestrictions);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-[calc(100vh-14rem)] items-center justify-center">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex h-[calc(100vh-14rem)] rounded-lg overflow-hidden border border-gray-200">
        {/* Chat Section - 60% width */}
        <div className="w-[60%] border-r border-gray-200 bg-gray-50/50">
          <ChatInterface
            key={profileId} // Force remount if profileId changes
            profileId={profileId}
            onUpdateRestrictions={handleUpdateRestrictions}
          />
        </div>
        {/* Restrictions Profile Section - 40% width */}
        <div className="w-[40%] bg-white">
          <div className="h-full overflow-y-auto px-8 py-6">
            <RestrictionsSummary
              restrictions={restrictions}
              onUpdateRestrictions={handleUpdateRestrictions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(ProfileClient);

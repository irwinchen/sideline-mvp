"use client";

import { withErrorBoundary } from "components/error-boundary";
import ChatInterface from "components/ui/chat-interface";
import { RestrictionsSummary } from "components/ui/restrictions-summary";
import { useState, useEffect } from "react";
import type { Restriction } from "lib/client/storage-service";
import { storageService } from "lib/client/storage-service";
import Joyride, {
  CallBackProps,
  Step,
  STATUS,
  ACTIONS,
  EVENTS,
  Placement,
} from "react-joyride";
import { useAuth } from "@clerk/nextjs";

function ProfileClient() {
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [runTour, setRunTour] = useState(false);
  const { isLoaded, userId } = useAuth();
  const profileId = userId || "demo-user";

  const getSteps = (): Step[] => {
    const steps = [
      {
        target: ".chat-section",
        content:
          "Start by using the chat interface here to tell us about your food restrictions. Simply type something like 'I'm allergic to peanuts' or 'I don't eat meat'.",
        placement: "right" as Placement,
        disableBeacon: true,
      },
      {
        target: ".restrictions-section",
        content:
          "As you chat about your restrictions, they'll automatically appear here in your restrictions profile card" +
          (!userId
            ? ". Create an account to save your preferences!"
            : " for easy reference."),
        placement: "left" as Placement,
      },
    ];
    return steps;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      localStorage.setItem("profile_tour_completed", "true");
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Only show tour if not completed before
    const tourCompleted =
      localStorage.getItem("profile_tour_completed") === "true";
    setRunTour(!tourCompleted);

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
  }, [isLoaded, userId, profileId]);

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
      <Joyride
        steps={getSteps()}
        run={runTour && isLoaded}
        continuous
        showProgress
        showSkipButton
        spotlightClicks
        disableOverlayClose
        spotlightPadding={8}
        styles={{
          options: {
            primaryColor: "#0f172a",
            textColor: "#334155",
            backgroundColor: "#ffffff",
            spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
          },
          spotlight: {
            borderRadius: "4px",
          },
        }}
        callback={handleJoyrideCallback}
      />
      <div className="flex h-[calc(100vh-14rem)] rounded-lg overflow-hidden border border-gray-200">
        {/* Chat Section - 60% width */}
        <div className="chat-section w-[60%] border-r border-gray-200 bg-gray-50/50">
          <ChatInterface
            key={profileId} // Force remount if profileId changes
            profileId={profileId}
            onUpdateRestrictions={handleUpdateRestrictions}
          />
        </div>
        {/* Restrictions Profile Section - 40% width */}
        <div className="restrictions-section w-[40%] bg-white">
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

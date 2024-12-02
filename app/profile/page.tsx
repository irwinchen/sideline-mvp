"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import DietarySummaryCard from "components/ui/dietary-summary-card";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

interface ProfileData {
  restrictions: Restriction[];
}

// Sample profile data for non-logged in users
const SAMPLE_PROFILE: ProfileData = {
  restrictions: [
    { item: "peanuts", type: "cannot" },
    { item: "shellfish", type: "cannot" },
    { item: "dairy", type: "willnot" },
    { item: "red meat", type: "willnot" },
  ],
};

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (isSignedIn && user) {
      // Fetch actual profile data when user is signed in
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          // For now, using sample data since API doesn't return real data yet
          setProfileData({
            restrictions: [
              { item: "gluten", type: "cannot" },
              { item: "soy", type: "willnot" },
            ],
          });
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, [isSignedIn, user]);

  // Show nothing while loading
  if (!isLoaded || !isClient) {
    return null;
  }

  const renderQRCode = (data: ProfileData | null, isSample = false) => {
    const qrValue = isSample
      ? "https://main.d3d6ak7p1vbc06.amplifyapp.com/p/sample"
      : `https://main.d3d6ak7p1vbc06.amplifyapp.com/p/${user?.id}`;

    return (
      <div className="flex flex-col items-center mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dietary Profile QR Code</h3>
        <QRCodeSVG value={qrValue} size={200} />
        {isSample && (
          <div className="mt-4 text-sm text-amber-600 text-center bg-amber-50 p-3 rounded-md w-full">
            This is a sample QR code for demonstration purposes only.
            <br />
            Sign in to generate your personal dietary profile QR code.
          </div>
        )}
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                This is a sample profile page showing example dietary
                restrictions and preferences. Sign in to create and manage your
                actual profile.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Sample Profile
              </h2>
              <p className="text-gray-600">example@sideline.com</p>
            </div>
            <DietarySummaryCard
              restrictions={SAMPLE_PROFILE.restrictions}
              readonly={true}
            />
            {renderQRCode(SAMPLE_PROFILE, true)}
            <div className="mt-6">
              <Link href="/sign-in">
                <Button className="w-full">
                  Sign In to Create Your Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
          <Link href={`/p/${user.id}`}>
            <Button variant="outline" size="sm">
              View Public Profile
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {profileData && (
            <DietarySummaryCard
              restrictions={profileData.restrictions}
              readonly={false}
            />
          )}
          {profileData && renderQRCode(profileData)}
        </div>
      </div>
    </div>
  );
}

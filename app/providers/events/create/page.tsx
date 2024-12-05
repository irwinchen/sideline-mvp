"use client";

import { useState, useEffect } from "react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [eventName, setEventName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Fetch user's profile to get their name
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setProfile(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!profile?.firstName) {
      alert(
        "Please complete your profile with your name before creating an event."
      );
      router.push("/profile/edit");
      return;
    }

    if (parseInt(guestCount) > 20) {
      alert(
        "Currently, we support events with up to 20 guests. For larger events, please contact us directly."
      );
      return;
    }

    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          guestCount: parseInt(guestCount),
          userId: user?.id,
          creatorName: profile.firstName,
        }),
      });

      if (!response.ok) throw new Error("Failed to create event");

      const data = await response.json();
      setGeneratedLink(`${window.location.origin}/events/${data.eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-8">Create Your Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium mb-2"
            >
              What&apos;s the event?
            </label>
            <Input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Birthday Dinner, Holiday Party"
              required
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="guestCount"
              className="block text-sm font-medium mb-2"
            >
              How many people do you plan to host?
            </label>
            <Input
              id="guestCount"
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="Enter number of guests"
              min="1"
              max="20"
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Maximum 20 guests</p>
          </div>

          <Button type="submit" className="w-full">
            Generate Guest Link
          </Button>
        </form>

        {generatedLink && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Share this link with your guests:
            </h2>
            <div className="flex items-center gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="bg-white"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert("Link copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This link will expire in one month. Your guests can use it to
              specify their dietary restrictions.
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}

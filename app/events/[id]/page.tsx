"use client";

import { useState, useEffect } from "react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import RestrictionsChecklist from "components/ui/restrictions-checklist";
import Link from "next/link";

export default function EventGuestPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [guestName, setGuestName] = useState("");
  const [restrictions, setRestrictions] = useState<
    Array<{ item: string; type: "cannot" | "willnot" }>
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch event details
    fetch(`/api/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEvent(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load event details");
        setLoading(false);
      });
  }, [params.id]);

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

  const handleSubmit = async () => {
    if (!guestName) {
      alert("Please enter your name");
      return;
    }

    try {
      const response = await fetch(`/api/events/${params.id}/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: guestName,
          restrictions,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setSubmitted(true);
    } catch (error) {
      alert("Failed to submit your restrictions. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-24 max-w-3xl">
        <Card className="p-8">
          <p className="text-center">Loading...</p>
        </Card>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="container mx-auto px-4 py-24 max-w-3xl">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error || "Event not found or has expired"}</p>
        </Card>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="container mx-auto px-4 py-24 max-w-3xl">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="mb-8">
            Your dietary restrictions have been recorded for {event.name}.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Want to save your dietary profile?
            </h2>
            <p className="mb-4">
              Create a Sideline account to save your dietary preferences and use
              them for future events and restaurant visits.
            </p>
            <Link href="/sign-up">
              <Button>Create Account</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600 mb-8">
          {event.creatorName}'s having a {event.name.toLowerCase()} and they'd
          like to know if you have any dietary restrictions
        </p>

        <div className="mb-6">
          <label htmlFor="guestName" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <Input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <RestrictionsChecklist
            restrictions={restrictions}
            onRemoveRestriction={handleRemoveRestriction}
            onToggleType={handleToggleType}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
      </Card>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Button } from "components/ui/button";
import { useAuth } from "@clerk/nextjs";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Button asChild size="lg">
        <Link href={isSignedIn ? "/profile" : "/sign-up"}>
          {isSignedIn ? "Go to Your Profile" : "Create Your Profile"}
        </Link>
      </Button>
      {!isSignedIn && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-primary">
            Ready to Make Dining Safer?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of members who dine with confidence.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>
      )}
    </>
  );
}

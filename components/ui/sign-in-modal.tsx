"use client";

import { SignIn } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Button } from "./button";

interface SignInModalProps {
  onClose: () => void;
}

const SignInModal = ({ onClose }: SignInModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SignIn afterSignInUrl="/onboarding" afterSignUpUrl="/onboarding" />
      </div>
    </div>
  );
};

export default SignInModal;

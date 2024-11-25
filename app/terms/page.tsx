import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Bell, UserCircle, Lock } from "lucide-react";

type Consents = {
  termsConsent: boolean;
  profileShareConsent: boolean;
};

type TermsAndConditionsProps = {
  onAccept: (consents: Consents) => void;
};

const TermsAndConditions = ({ onAccept }: TermsAndConditionsProps) => {
  const [consents, setConsents] = useState<Consents>({
    termsConsent: false,
    profileShareConsent: false,
  });

  const handleConsentChange = (key: keyof Consents) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isFullyConsented =
    consents.termsConsent && consents.profileShareConsent;

  const sections = [
    {
      title: "What We Collect",
      icon: <UserCircle className="h-5 w-5" />,
      items: [
        "Your dietary restrictions and food allergies",
        "Contact information (email and phone number)",
        "Profile access history (who viewed your information and when)",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: <Shield className="h-5 w-5" />,
      items: [
        "To create your shareable dietary profile",
        "To generate your digital wallet card",
        "To notify you when your profile is accessed",
        "To enable authorized providers to verify your restrictions",
      ],
    },
    {
      title: "Your Health Information Rights",
      icon: <Lock className="h-5 w-5" />,
      items: [
        "You choose what information to share",
        "You control who can access your profile",
        "You can modify or delete your information anytime",
        "You receive notifications when your profile is viewed",
      ],
    },
    {
      title: "Security Measures",
      icon: <Bell className="h-5 w-5" />,
      items: [
        "All data is encrypted",
        "Access is limited to authorized providers",
        "Commercial providers undergo verification",
        "Regular security audits are conducted",
      ],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sideline Terms & Conditions Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="bg-muted">
            <AlertDescription className="text-sm text-muted-foreground">
              At Sideline, we help you communicate your food restrictions safely
              and efficiently. Before creating your profile, please review how
              we handle your information:
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    {section.icon}
                    {section.title}
                  </div>
                  <ul className="list-disc space-y-2 pl-10">
                    {section.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-sm text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="space-y-3">
                <div className="text-lg font-semibold">Important Notes</div>
                <ul className="list-disc space-y-2 pl-10">
                  <li className="text-sm text-muted-foreground">
                    We never sell your personal information
                  </li>
                  <li className="text-sm text-muted-foreground">
                    We don't share your phone number - it's only used for
                    profile lookup by verified commercial providers
                  </li>
                  <li className="text-sm text-muted-foreground">
                    Your profile link is pseudonymous - it doesn't contain
                    personally identifiable information
                  </li>
                  <li className="text-sm text-muted-foreground">
                    You can revoke access to your profile at any time
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="text-lg font-semibold">Consent</div>
                <p className="text-sm text-muted-foreground">
                  By proceeding, you acknowledge that:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={consents.termsConsent}
                      onCheckedChange={() =>
                        handleConsentChange("termsConsent")
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand and consent to these terms
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="share"
                      checked={consents.profileShareConsent}
                      onCheckedChange={() =>
                        handleConsentChange("profileShareConsent")
                      }
                    />
                    <label
                      htmlFor="share"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand that my dietary profile will be accessible to
                      those I share it with
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={() => onAccept(consents)}
            disabled={!isFullyConsented}
            className="w-full"
          >
            Accept and Continue
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            For complete terms and privacy policy, visit{" "}
            <a
              href="https://sideline.menu/legal"
              className="underline transition-colors hover:text-primary"
            >
              sideline.menu/legal
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default TermsAndConditions;

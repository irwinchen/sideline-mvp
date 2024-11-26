# .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}

```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

# app/api/profile/route.ts

```ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    console.log(data);
    // TODO: Save profile data to your database
    // This will depend on your database setup (e.g., Supabase, PostgreSQL)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

```

# app/favicon.ico

This is a binary file of the type: Binary

# app/fonts/GeistMonoVF.woff

This is a binary file of the type: Binary

# app/fonts/GeistVF.woff

This is a binary file of the type: Binary

# app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

# app/layout.tsx

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sideline Prototype",
  description:
    "Share your dietary requirements instantly with restaurants and hosts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

```

# app/onboarding/page.tsx

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Apple, Utensils, AlertTriangle } from "lucide-react";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s create your dietary profile to help you communicate your
            needs effectively
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Dietary Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <Tabs defaultValue="restrictions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="restrictions">
                  <Utensils className="mr-2 h-4 w-4" />
                  Restrictions
                </TabsTrigger>
                <TabsTrigger value="allergies">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Allergies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="restrictions" className="space-y-4">
                <div className="space-y-4 pt-4">
                  {[
                    "Vegetarian",
                    "Vegan",
                    "Halal",
                    "Kosher",
                    "Gluten-Free",
                    "Dairy-Free",
                  ].map((restriction) => (
                    <div
                      key={restriction}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={restriction.toLowerCase()} />
                      <Label htmlFor={restriction.toLowerCase()}>
                        {restriction}
                      </Label>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Label htmlFor="other-restrictions">
                      Other Restrictions
                    </Label>
                    <Input
                      id="other-restrictions"
                      placeholder="E.g., No pork, No shellfish"
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="allergies" className="space-y-4">
                <Alert className="bg-muted">
                  <AlertDescription>
                    List any food allergies, including severity level. This
                    information will be clearly communicated to food service
                    providers.
                  </AlertDescription>
                </Alert>
                <div className="space-y-4 pt-2">
                  {[
                    "Peanuts",
                    "Tree Nuts",
                    "Shellfish",
                    "Fish",
                    "Eggs",
                    "Milk",
                    "Soy",
                    "Wheat",
                  ].map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox id={allergy.toLowerCase()} />
                      <Label htmlFor={allergy.toLowerCase()}>{allergy}</Label>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Label htmlFor="other-allergies">Other Allergies</Label>
                    <Input
                      id="other-allergies"
                      placeholder="E.g., Sesame, Mustard"
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <Label>Additional Notes</Label>
              <Input
                placeholder="Any other dietary preferences or important information"
                className="h-24"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" size="lg">
              Save Profile
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Apple className="mr-2 h-4 w-4" />
              Add to Apple Wallet
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You can update your profile anytime from your dashboard
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

```

# app/page.tsx

```tsx
import Link from "next/link";
import { QrCode, Globe, Shield, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container space-y-16 text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Communicate Your Food Needs,{" "}
            <span className="text-primary">Anywhere, Anytime</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Share your dietary requirements instantly with restaurants and hosts
            - in their language, with confidence that they understand.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">Create Your Profile</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <FeatureCard
            icon={<QrCode className="h-8 w-8 text-primary" />}
            title="Instant Sharing"
            description="Show your QR code or share your link - no app needed"
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-primary" />}
            title="Any Language"
            description="Automatically translates for kitchen staff worldwide"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary" />}
            title="Privacy First"
            description="Your health information stays private and secure"
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-primary" />}
            title="Easy Access"
            description="Saves to your digital wallet for quick access"
          />
        </div>

        {/* Testimonial */}
        <Card className="mx-auto max-w-2xl p-8">
          <blockquote className="space-y-4">
            <p className="text-muted-foreground italic">
              &quot;Finally, I can travel and dine out without anxiety about my
              food allergies.&quot;
            </p>
            <footer className="space-y-1">
              <p className="font-semibold">Sarah M.</p>
              <p className="text-sm text-muted-foreground">Sideline Member</p>
            </footer>
          </blockquote>
        </Card>

        {/* CTA Section */}
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
      </div>
    </main>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};

```

# app/privacy/page.tsx

```tsx

```

# app/profile/edit/page.tsx

```tsx

```

# app/profile/layout.tsx

```tsx

```

# app/profile/settings/page.tsx

```tsx

```

# app/providers.tsx

```tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

```

# app/sign-up/[[...sign-up]]/page.tsx

```tsx
import { SignUp } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Sideline",
  description:
    "Create your Sideline profile to share your dietary requirements safely and easily.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 md:p-24">
      <div className="container max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Your Profile
          </h1>
          <p className="text-muted-foreground">
            Join Sideline to communicate your dietary needs effectively
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "text-slate-900 font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors",
                formFieldInput:
                  "rounded-lg border-input focus:border-primary focus:ring-primary",
                footerAction: "text-muted-foreground",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
            redirectUrl="/onboarding"
          />
        </Card>
      </div>
    </main>
  );
}

```

# app/terms/page.tsx

```tsx
// Server Component
import TermsClient from "./TermsClient";
import { redirect } from "next/navigation";

export default function TermsPage() {
  const handleAccept = async (consents: {
    termsConsent: boolean;
    profileShareConsent: boolean;
  }) => {
    "use server";
    // Save consents to database
    console.log("Saving consents:", consents); // Temporary usage until DB implementation
    redirect("/onboarding");
  };

  return <TermsClient onAccept={handleAccept} />;
}

```

# app/terms/TermsClient.tsx

```tsx
"use client";

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
                    We don&apos;t share your phone number - it&apos;s only used
                    for profile lookup by verified commercial providers
                  </li>
                  <li className="text-sm text-muted-foreground">
                    Your profile link is pseudonymous - it doesn&apos;t contain
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

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

# components/ui/alert.tsx

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

```

# components/ui/button.tsx

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

# components/ui/card.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

# components/ui/checkbox.tsx

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

```

# components/ui/input.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```

# components/ui/label.tsx

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

# components/ui/scroll-area.tsx

```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }

```

# components/ui/tabs.tsx

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

```

# lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

# middleware.ts

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)", // Allow webhook endpoints
  "/_next(.*)", // Allow Next.js internal routes
  "/favicon.ico",
  "/sitemap.xml",
]);

export default clerkMiddleware(async (auth, req) => {
  // Early return for public routes
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Redirect to sign in if no user
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

  // Optimize image handling
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.clerk.com",
      },
      // Add any other domains you need for images
    ],
  },

  // Remove experimental flag since app directory is stable in Next.js 14
  experimental: {
    // Note: removing appDir flag as it's now stable in Next.js 14
    serverActions: true,
  },

  // These headers are important for a medical data application
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Configure redirects for clean URLs
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Webpack configuration for better build optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: "deterministic",
    };

    return config;
  },
};

module.exports = nextConfig;

```

# next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

# package.json

```json
{
  "name": "sideline-mvp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.5.0",
    "@clerk/types": "^4.35.0",
    "@next/font": "^14.2.15",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@tanstack/react-query": "^5.61.0",
    "@tanstack/react-query-devtools": "^5.61.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "next": "14.0.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "shadcn-ui": "^0.2.3",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@shadcn/ui": "^0.0.4",
    "@types/node": "20.10.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "eslint": "8.54.0",
    "eslint-config-next": "14.0.3",
    "postcss": "8.4.31",
    "tailwindcss": "3.3.5",
    "typescript": "5.3.2"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}

```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# public/file.svg

This is a file of the type: SVG Image

# public/globe.svg

This is a file of the type: SVG Image

# public/next.svg

This is a file of the type: SVG Image

# public/vercel.svg

This is a file of the type: SVG Image

# public/window.svg

This is a file of the type: SVG Image

# README.md

```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```


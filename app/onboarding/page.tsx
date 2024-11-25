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
            Let's create your dietary profile to help you communicate your needs
            effectively
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

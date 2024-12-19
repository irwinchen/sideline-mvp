import { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Your Food Restrictions Profile | Sideline",
  description:
    "Manage your dietary restrictions and preferences with our intelligent chat interface.",
  openGraph: {
    title: "Your Dietary Profile | Sideline",
    description:
      "Manage your dietary restrictions and preferences with our intelligent chat interface.",
    type: "website",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}

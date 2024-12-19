"use client";

import { useEffect, useState } from "react";
import { Card } from "components/ui/card";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import { Button } from "components/ui/button";
import { QRCodeSVG } from "qrcode.react";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type ProfileData = {
  restrictions: Restriction[];
  updatedAt: string;
  language?: string;
};

type Language = "en" | "es" | "zh" | "ja";

const translations = {
  en: {
    title: "Dietary Profile",
    lastUpdated: "Last updated",
    shareProfile: "Share Profile",
    demo: "Demo Profile",
  },
  es: {
    title: "Perfil Dietético",
    lastUpdated: "Última actualización",
    shareProfile: "Compartir Perfil",
    demo: "Perfil de Demostración",
  },
  zh: {
    title: "饮食档案",
    lastUpdated: "最后更新",
    shareProfile: "分享档案",
    demo: "演示档案",
  },
  ja: {
    title: "食事プロフィール",
    lastUpdated: "最終更新",
    shareProfile: "プロフィールを共有",
    demo: "デモプロフィール",
  },
};

export default function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [translatedContent, setTranslatedContent] = useState(translations.en);

  const profileUrl = typeof window !== "undefined" ? window.location.href : "";
  const isDemo = params.id === "demo-user";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `/api/profile/public/${params.id}?lang=${selectedLanguage}`
        );
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Could not load profile");
      }
    };

    fetchProfile();
  }, [params.id, selectedLanguage]);

  useEffect(() => {
    setTranslatedContent(translations[selectedLanguage]);
  }, [selectedLanguage]);

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: translatedContent.title,
          url: profileUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(profileUrl);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{translatedContent.title}</h1>
            {isDemo && (
              <p className="text-sm text-gray-500 mt-1">
                {translatedContent.demo}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedLanguage === "en" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("en")}
              size="sm"
            >
              English
            </Button>
            <Button
              variant={selectedLanguage === "es" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("es")}
              size="sm"
            >
              Español
            </Button>
            <Button
              variant={selectedLanguage === "zh" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("zh")}
              size="sm"
            >
              中文
            </Button>
            <Button
              variant={selectedLanguage === "ja" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("ja")}
              size="sm"
            >
              日本語
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <DietarySummaryCard
            restrictions={profile.restrictions}
            readonly={true}
            language={selectedLanguage}
          />
        </Card>

        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG value={profileUrl} size={200} />
          <Button onClick={handleShare} variant="outline">
            {translatedContent.shareProfile}
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          {translatedContent.lastUpdated}:{" "}
          {new Date(profile.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

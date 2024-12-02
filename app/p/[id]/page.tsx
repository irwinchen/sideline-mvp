"use client";

import { useEffect, useState } from "react";
import { Card } from "components/ui/card";
import DietarySummaryCard from "components/ui/dietary-summary-card";
import { Button } from "components/ui/button";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type ProfileData = {
  restrictions: Restriction[];
  updatedAt: string;
};

type Language = "en" | "es" | "zh" | "ja";

export default function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [translatedContent, setTranslatedContent] = useState<{
    title: string;
    lastUpdated: string;
  }>({
    title: "Dietary Profile",
    lastUpdated: "Last updated",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/public/${params.id}`);
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
  }, [params.id]);

  useEffect(() => {
    const translateContent = async () => {
      // Translation content based on selected language
      const translations = {
        en: {
          title: "Dietary Profile",
          lastUpdated: "Last updated",
        },
        es: {
          title: "Perfil Dietético",
          lastUpdated: "Última actualización",
        },
        zh: {
          title: "饮食档案",
          lastUpdated: "最后更新",
        },
        ja: {
          title: "食事プロフィール",
          lastUpdated: "最終更新",
        },
      };

      setTranslatedContent(translations[selectedLanguage]);
    };

    translateContent();
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{translatedContent.title}</h1>
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
        <p className="text-sm text-gray-500 text-center">
          {translatedContent.lastUpdated}:{" "}
          {new Date(profile.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

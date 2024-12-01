import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import {
  FaBreadSlice,
  FaGlassWhiskey,
  FaSeedling,
  FaFish,
  FaDrumstickBite,
} from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { MdTranslate, MdCancel, MdClose } from "react-icons/md";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type DietarySummaryCardProps = {
  restrictions: Restriction[];
  readonly?: boolean;
};

const translations = {
  en: {
    "Cannot Eat": "Cannot Eat",
    "Prefer Not to Eat": "Prefer Not to Eat",
    peanuts: "peanuts",
    shellfish: "shellfish",
    dairy: "dairy",
    "red meat": "red meat",
    Summary:
      "I have dietary restrictions that I would like respected. I cannot eat: {cannotEat}. I prefer not to eat: {willNotEat}.",
  },
  es: {
    "Cannot Eat": "No Puedo Comer",
    "Prefer Not to Eat": "Prefiero No Comer",
    peanuts: "cacahuetes",
    shellfish: "mariscos",
    dairy: "lácteos",
    "red meat": "carne roja",
    Summary:
      "Tengo restricciones dietéticas que me gustaría que se respeten. No puedo comer: {cannotEat}. Prefiero no comer: {willNotEat}.",
  },
  fr: {
    "Cannot Eat": "Ne Peux Pas Manger",
    "Prefer Not to Eat": "Préfère Ne Pas Manger",
    peanuts: "cacahuètes",
    shellfish: "fruits de mer",
    dairy: "produits laitiers",
    "red meat": "viande rouge",
    Summary:
      "J'ai des restrictions alimentaires que j'aimerais voir respectées. Je ne peux pas manger: {cannotEat}. Je préfère ne pas manger: {willNotEat}.",
  },
};

const getIconForRestriction = (item: string, type: "cannot" | "willnot") => {
  const lowerItem = item.toLowerCase();
  let foodIcon;

  if (lowerItem.includes("gluten") || lowerItem.includes("wheat"))
    foodIcon = <FaBreadSlice className="text-red-500" />;
  else if (lowerItem.includes("dairy") || lowerItem.includes("milk"))
    foodIcon = <FaGlassWhiskey className="text-blue-500" />;
  else if (lowerItem.includes("nut"))
    foodIcon = <FaSeedling className="text-amber-700" />;
  else if (lowerItem.includes("fish") || lowerItem.includes("shellfish"))
    foodIcon = <FaFish className="text-cyan-600" />;
  else if (lowerItem.includes("meat"))
    foodIcon = <FaDrumstickBite className="text-rose-600" />;
  else foodIcon = <IoWarning className="text-yellow-500" />;

  return (
    <div className="relative">
      {foodIcon}
      {type === "cannot" ? (
        <MdClose className="absolute -top-1 -right-1 text-red-500 text-xs bg-white rounded-full" />
      ) : (
        <MdCancel className="absolute -top-1 -right-1 text-yellow-500 text-xs bg-white rounded-full" />
      )}
    </div>
  );
};

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
];

export default function DietarySummaryCard({
  restrictions,
  readonly = false,
}: DietarySummaryCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const translate = (key: string) => {
    return (
      translations[selectedLanguage as keyof typeof translations]?.[
        key as keyof (typeof translations)["en"]
      ] || key
    );
  };

  const translateItem = (item: string) => {
    return translate(item.toLowerCase()) || item;
  };

  const getSummaryText = () => {
    const cannotEat = restrictions
      .filter((r) => r.type === "cannot")
      .map((r) => translateItem(r.item))
      .join(", ");

    const willNotEat = restrictions
      .filter((r) => r.type === "willnot")
      .map((r) => translateItem(r.item))
      .join(", ");

    const summary = translate("Summary")
      .replace("{cannotEat}", cannotEat || "N/A")
      .replace("{willNotEat}", willNotEat || "N/A");

    return summary;
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <div className="h-full border-l border-t">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Summary for Providers</h2>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <MdTranslate className="text-gray-600" />
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            {!readonly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="h-[300px] p-4">
        <Card className="p-4">
          {!readonly && editMode ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-32 p-2 border rounded-md"
                value={getSummaryText()}
                readOnly
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">{translate("Cannot Eat")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {restrictions
                    .filter((r) => r.type === "cannot")
                    .map((restriction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-red-50 p-2 rounded-md"
                      >
                        {getIconForRestriction(restriction.item, "cannot")}
                        <span className="text-sm">
                          {translateItem(restriction.item)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">
                  {translate("Prefer Not to Eat")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {restrictions
                    .filter((r) => r.type === "willnot")
                    .map((restriction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-yellow-50 p-2 rounded-md"
                      >
                        {getIconForRestriction(restriction.item, "willnot")}
                        <span className="text-sm">
                          {translateItem(restriction.item)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-800">{getSummaryText()}</p>
              </div>
            </div>
          )}
        </Card>
      </ScrollArea>
    </div>
  );
}

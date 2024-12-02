import { useState } from "react";
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
import { MdCancel, MdClose } from "react-icons/md";
import { restrictionTranslations } from "@/lib/translations";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type DietarySummaryCardProps = {
  restrictions: Restriction[];
  readonly?: boolean;
  language?: "en" | "es" | "zh" | "ja";
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

export default function DietarySummaryCard({
  restrictions,
  readonly = false,
  language = "en",
}: DietarySummaryCardProps) {
  const [editMode, setEditMode] = useState(false);

  const translate = (key: string) => {
    if (language === "en") return key;
    return restrictionTranslations[key.toLowerCase()]?.[language] || key;
  };

  const translateItem = (item: string) => {
    return translate(item.toLowerCase());
  };

  const getSummaryText = () => {
    const cannotEatItems = restrictions
      .filter((r) => r.type === "cannot")
      .map((r) => translateItem(r.item))
      .join(", ");

    const willNotEatItems = restrictions
      .filter((r) => r.type === "willnot")
      .map((r) => translateItem(r.item))
      .join(", ");

    if (language === "en") {
      let summary = `I have dietary restrictions that I would like respected. I cannot eat: ${cannotEatItems}`;
      if (willNotEatItems) {
        summary += `. I prefer not to eat: ${willNotEatItems}`;
      }
      summary += ".";
      return summary;
    }

    if (!willNotEatItems) {
      return restrictionTranslations["SummaryCannotOnly"][language].replace(
        "{cannotEat}",
        cannotEatItems
      );
    }

    return restrictionTranslations["SummaryBoth"][language]
      .replace("{cannotEat}", cannotEatItems)
      .replace("{willNotEat}", willNotEatItems);
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <div className="h-full border-l border-t">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Food Restrictions</h2>
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
                <h3 className="font-medium">{translate("Will Not Eat")}</h3>
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

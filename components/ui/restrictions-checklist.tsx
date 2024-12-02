import { X } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { useState } from "react";
import { restrictionTranslations } from "@/lib/translations";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type RestrictionsChecklistProps = {
  restrictions: Restriction[];
  onRemoveRestriction?: (item: string) => void;
  onToggleType?: (item: string) => void;
  readonly?: boolean;
  language?: "en" | "es" | "zh" | "ja";
};

type StateOption = null | "cannot" | "willnot";

export default function RestrictionsChecklist({
  restrictions,
  onRemoveRestriction,
  onToggleType,
  readonly = false,
  language = "en",
}: RestrictionsChecklistProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const translate = (key: string) => {
    if (language === "en") return key;
    return restrictionTranslations[key.toLowerCase()]?.[language] || key;
  };

  const getCircleColor = (type: StateOption) => {
    switch (type) {
      case "cannot":
        return "bg-red-500";
      case "willnot":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleStateClick = (item: string) => {
    if (readonly) return;
    if (activeDropdown === item) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(item);
    }
  };

  const groupedRestrictions = restrictions.reduce((acc, restriction) => {
    const type =
      restriction.type === "cannot"
        ? translate("Cannot Eat")
        : translate("Will Not Eat");
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(restriction);
    return acc;
  }, {} as Record<string, Restriction[]>);

  return (
    <div className="h-full border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Your Dietary Restrictions</h2>
      </div>

      <ScrollArea className="h-[400px] p-4">
        {Object.entries(groupedRestrictions).map(([type, items]) => (
          <div key={type} className="mb-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">{type}</h3>
            <div className="space-y-2">
              {items.map((restriction) => (
                <div
                  key={restriction.item}
                  className="flex items-center gap-2 group relative"
                >
                  <div className="flex items-center gap-3 flex-1 p-2 rounded-md text-sm bg-slate-50">
                    <button
                      onClick={() => handleStateClick(restriction.item)}
                      className={`w-5 h-5 rounded-full relative ${
                        readonly ? "cursor-default" : ""
                      }`}
                      disabled={readonly}
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${getCircleColor(
                          restriction.type
                        )}`}
                      />
                    </button>
                    <span>{translate(restriction.item)}</span>
                    {!readonly &&
                      activeDropdown === restriction.item &&
                      onToggleType &&
                      onRemoveRestriction && (
                        <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg border z-10">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                onRemoveRestriction(restriction.item);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded w-full"
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-gray-300`}
                              />
                              <span>None</span>
                            </button>
                            <button
                              onClick={() => {
                                if (restriction.type !== "cannot") {
                                  onToggleType(restriction.item);
                                }
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded w-full"
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-red-500`}
                              />
                              <span>{translate("Cannot Eat")}</span>
                            </button>
                            <button
                              onClick={() => {
                                if (restriction.type !== "willnot") {
                                  onToggleType(restriction.item);
                                }
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded w-full"
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-yellow-500`}
                              />
                              <span>{translate("Will Not Eat")}</span>
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                  {!readonly && onRemoveRestriction && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveRestriction(restriction.item)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedRestrictions).length === 0 && (
          <div className="text-center text-slate-500 mt-8">
            <p>{translate("No dietary restrictions added yet.")}</p>
            <p className="text-sm mt-2">
              {translate("Your restrictions will appear here as you chat.")}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

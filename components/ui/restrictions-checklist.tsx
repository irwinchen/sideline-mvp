import { X } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { useState } from "react";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type RestrictionsChecklistProps = {
  restrictions: Restriction[];
  onRemoveRestriction: (item: string) => void;
  onToggleType: (item: string) => void;
};

type StateOption = null | "cannot" | "willnot";

export default function RestrictionsChecklist({
  restrictions,
  onRemoveRestriction,
  onToggleType,
}: RestrictionsChecklistProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    if (activeDropdown === item) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(item);
    }
  };

  const groupedRestrictions = restrictions.reduce((acc, restriction) => {
    const type = restriction.type === "cannot" ? "Cannot Eat" : "Will Not Eat";
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

      <ScrollArea className="h-[calc(100%-4rem)] p-4">
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
                      className="w-5 h-5 rounded-full relative"
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${getCircleColor(
                          restriction.type
                        )}`}
                      />
                    </button>
                    <span>
                      {restriction.item.charAt(0).toUpperCase() +
                        restriction.item.slice(1)}
                    </span>
                    {activeDropdown === restriction.item && (
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
                            <span>Cannot Eat</span>
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
                            <span>Will Not Eat</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveRestriction(restriction.item)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedRestrictions).length === 0 && (
          <div className="text-center text-slate-500 mt-8">
            <p>No dietary restrictions added yet.</p>
            <p className="text-sm mt-2">
              Your restrictions will appear here as you chat.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
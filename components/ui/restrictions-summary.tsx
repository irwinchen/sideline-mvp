"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { AlertCircle, XCircle, Share2 } from "lucide-react";
import { Restriction } from "lib/client/storage-service";
import { useRouter } from "next/navigation";

interface RestrictionsSummaryProps {
  restrictions: Restriction[];
  onUpdateRestrictions: (restrictions: Restriction[]) => void;
}

type RestrictionType = "cannot" | "willnot";

export function RestrictionsSummary({
  restrictions,
  onUpdateRestrictions,
}: RestrictionsSummaryProps) {
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  // Group restrictions by type only
  const groupedRestrictions = restrictions.reduce<{
    [K in RestrictionType]: Restriction[];
  }>(
    (acc, restriction) => {
      const key = restriction.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(restriction);
      return acc;
    },
    { cannot: [], willnot: [] }
  );

  const handleRemoveRestriction = (itemToRemove: string) => {
    const updatedRestrictions = restrictions.filter(
      (restriction) => restriction.item !== itemToRemove
    );
    onUpdateRestrictions(updatedRestrictions);
  };

  const handleToggleType = (itemToToggle: string) => {
    const updatedRestrictions = restrictions.map((restriction): Restriction => {
      if (restriction.item === itemToToggle) {
        const newType: RestrictionType =
          restriction.type === "cannot" ? "willnot" : "cannot";
        return {
          ...restriction,
          type: newType,
        };
      }
      return restriction;
    });
    onUpdateRestrictions(updatedRestrictions);
  };

  const handleGenerateProfile = () => {
    router.push("/p/demo-user");
  };

  const renderRestrictionGroup = (
    groupRestrictions: Restriction[],
    type: RestrictionType
  ) => {
    if (groupRestrictions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {groupRestrictions.map((restriction) => (
          <div
            key={`${restriction.item}-${restriction.type}`}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              type === "cannot"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <span>{restriction.item}</span>
            {editMode && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleType(restriction.item)}
                  className="p-1 hover:bg-white rounded-full transition-colors"
                  title={`Change to ${
                    type === "cannot" ? "prefer not to eat" : "cannot eat"
                  }`}
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                </button>
                <button
                  onClick={() => handleRemoveRestriction(restriction.item)}
                  className="p-1 hover:bg-white rounded-full transition-colors"
                  title="Remove restriction"
                >
                  <div className="flex items-center">
                    <XCircle className="h-3 w-3" />
                  </div>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRestrictionSection = (type: RestrictionType, title: string) => {
    if (groupedRestrictions[type].length === 0) return null;

    return (
      <div key={type} className="space-y-4">
        <h4
          className={`font-medium ${
            type === "cannot" ? "text-red-800" : "text-yellow-800"
          }`}
        >
          {title}
        </h4>
        {renderRestrictionGroup(groupedRestrictions[type], type)}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Dietary Restrictions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done" : "Edit"}
        </Button>
      </div>

      {restrictions.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No dietary restrictions added yet. Your restrictions will appear here
          as you chat.
        </p>
      ) : (
        <div className="space-y-6">
          {renderRestrictionSection("cannot", "Cannot Eat")}
          {renderRestrictionSection("willnot", "Prefer Not to Eat")}
        </div>
      )}

      {editMode && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Click the alert icon to change a restriction&apos;s type, or the X
            icon to remove it. Changes are saved automatically.
          </p>
        </div>
      )}

      {!editMode && restrictions.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateProfile}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Generate Profile
          </Button>
        </div>
      )}
    </Card>
  );
}

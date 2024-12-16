"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Label } from "./label";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Restriction } from "lib/client/storage-service";
import { nlpService } from "lib/client/nlp-service";

interface RestrictionsSummaryProps {
  restrictions: Restriction[];
  onUpdateRestrictions: (restrictions: Restriction[]) => void;
}

type ConfidenceLevel = "high" | "medium" | "low";
type RestrictionType = "cannot" | "willnot";

export function RestrictionsSummary({
  restrictions,
  onUpdateRestrictions,
}: RestrictionsSummaryProps) {
  const [editMode, setEditMode] = useState(false);

  // Group restrictions by type and confidence
  const groupedRestrictions = restrictions.reduce<{
    [K in RestrictionType]: { [L in ConfidenceLevel]: Restriction[] };
  }>(
    (acc, restriction) => {
      const confidence = restriction.confidence || 0;
      const key = restriction.type;
      const confidenceKey: ConfidenceLevel =
        confidence >= 0.8 ? "high" : confidence >= 0.5 ? "medium" : "low";

      if (!acc[key][confidenceKey]) {
        acc[key][confidenceKey] = [];
      }

      acc[key][confidenceKey].push(restriction);
      return acc;
    },
    {
      cannot: { high: [], medium: [], low: [] },
      willnot: { high: [], medium: [], low: [] },
    }
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

  const renderConfidenceIndicator = (confidence: number = 0) => {
    if (confidence >= 0.8) {
      return (
        <div className="flex items-center" title="High confidence">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </div>
      );
    }
    if (confidence >= 0.5) {
      return (
        <div className="flex items-center" title="Medium confidence">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return (
      <div className="flex items-center" title="Low confidence">
        <AlertCircle className="h-4 w-4 text-gray-400" />
      </div>
    );
  };

  const renderRestrictionGroup = (
    groupRestrictions: Restriction[],
    type: RestrictionType,
    confidence: ConfidenceLevel
  ) => {
    if (groupRestrictions.length === 0) return null;

    return (
      <div key={`${type}-${confidence}`} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {confidence === "high"
              ? "Confirmed"
              : confidence === "medium"
              ? "Likely"
              : "Possible"}
          </Label>
          {renderConfidenceIndicator(
            confidence === "high" ? 1 : confidence === "medium" ? 0.7 : 0.3
          )}
        </div>
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
      </div>
    );
  };

  const renderRestrictionSection = (type: RestrictionType, title: string) => (
    <div key={type} className="space-y-4">
      <h4
        className={`font-medium ${
          type === "cannot" ? "text-red-800" : "text-yellow-800"
        }`}
      >
        {title}
      </h4>
      {(["high", "medium", "low"] as const).map((confidence) =>
        renderRestrictionGroup(
          groupedRestrictions[type][confidence],
          type,
          confidence
        )
      )}
    </div>
  );

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
    </Card>
  );
}

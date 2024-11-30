import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

type Restriction = {
  item: string;
  type: "cannot" | "willnot";
};

type DietarySummaryCardProps = {
  restrictions: Restriction[];
  readonly?: boolean;
};

export default function DietarySummaryCard({
  restrictions,
  readonly = false,
}: DietarySummaryCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [summaryText, setSummaryText] = useState<string>(() => {
    const cannotEat = restrictions
      .filter((r) => r.type === "cannot")
      .map((r) => r.item)
      .join(", ");
    const willNotEat = restrictions
      .filter((r) => r.type === "willnot")
      .map((r) => r.item)
      .join(", ");

    return `I have dietary restrictions that I would like respected. I cannot eat: ${
      cannotEat || "N/A"
    }. I prefer not to eat: ${willNotEat || "N/A"}.`;
  });

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <div className="h-full border-l border-t">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Summary for Providers</h2>
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

      <ScrollArea className="h-[200px] p-4">
        <Card className="p-4">
          {!readonly && editMode ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-32 p-2 border rounded-md"
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <p className="text-sm text-slate-700">{summaryText}</p>
          )}
        </Card>
      </ScrollArea>
    </div>
  );
}

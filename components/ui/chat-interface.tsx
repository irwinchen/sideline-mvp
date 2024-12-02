import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Input } from "./input";
import { Send } from "lucide-react";
import { restrictionTranslations } from "@/lib/translations";

type Message = {
  id: string;
  type: "bot" | "user";
  content: string;
};

type ChatInterfaceProps = {
  onUpdateRestrictions: (
    restrictions: { item: string; type: "cannot" | "willnot" }[]
  ) => void;
};

type RestrictionType = "cannot" | "willnot";
type Restriction = { item: string; type: RestrictionType };

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      "Hi! I'll help you set up your dietary restrictions. Do you have any food allergies?",
  },
  {
    id: "2",
    type: "user",
    content: "I cannot eat black pepper and peppers",
  },
  {
    id: "3",
    type: "bot",
    content:
      "I've noted those restrictions. Is there anything else I should know about your dietary preferences?",
  },
];

const processResponse = (message: string): Restriction[] => {
  const restrictions: Restriction[] = [];
  const lowerMessage = message.toLowerCase();

  // Common allergens and dietary items to check for
  const allergens = [
    "peanuts",
    "nuts",
    "shellfish",
    "fish",
    "eggs",
    "milk",
    "dairy",
    "soy",
    "wheat",
    "gluten",
    "seafood",
    "tree nuts",
    "black pepper",
    "peppers",
  ];

  // Check for translations
  Object.entries(restrictionTranslations).forEach(([item, translations]) => {
    const translatedTerms = [
      item.toLowerCase(),
      translations.es.toLowerCase(),
      translations.zh.toLowerCase(),
      translations.ja.toLowerCase(),
    ];

    if (translatedTerms.some((term) => lowerMessage.includes(term))) {
      const type: RestrictionType =
        lowerMessage.includes("allerg") ||
        lowerMessage.includes("cannot") ||
        lowerMessage.includes("can't")
          ? "cannot"
          : "willnot";

      if (!restrictions.some((r) => r.item === item)) {
        restrictions.push({ item, type });
      }
    }
  });

  // Dietary preferences and restrictions
  const dietaryTypes: Array<{
    term: string;
    items: Restriction[];
  }> = [
    {
      term: "kosher",
      items: [
        { item: "pork", type: "cannot" },
        { item: "shellfish", type: "cannot" },
        { item: "mixing meat and dairy", type: "cannot" },
      ],
    },
    {
      term: "halal",
      items: [
        { item: "pork", type: "cannot" },
        { item: "alcohol", type: "cannot" },
        { item: "non-halal meat", type: "cannot" },
      ],
    },
    {
      term: "vegetarian",
      items: [
        { item: "meat", type: "cannot" },
        { item: "fish", type: "cannot" },
      ],
    },
    {
      term: "vegan",
      items: [
        { item: "meat", type: "cannot" },
        { item: "fish", type: "cannot" },
        { item: "dairy", type: "cannot" },
        { item: "eggs", type: "cannot" },
        { item: "honey", type: "cannot" },
      ],
    },
  ];

  // Check for dietary types (kosher, halal, vegetarian, vegan)
  dietaryTypes.forEach(({ term, items }) => {
    if (lowerMessage.includes(term)) {
      items.forEach((item) => restrictions.push(item));
    }
  });

  // Check for "I don't eat X" or "I can't eat X" or "I avoid X" patterns
  const avoidancePatterns = [
    /(?:i (?:don't|do not|dont) eat) (.+?)(?:\.|\s|$)/i,
    /(?:i (?:can't|cannot) eat) (.+?)(?:\.|\s|$)/i,
    /(?:i (?:avoid|stay away from)) (.+?)(?:\.|\s|$)/i,
    /(?:no) (.+?)(?:\.|\s|$)/i,
  ];

  avoidancePatterns.forEach((pattern) => {
    const match = lowerMessage.match(pattern);
    if (match) {
      const foods = match[1].split(/(?:,| and )/);
      foods.forEach((food) => {
        const cleanFood = food.trim().replace(/^(no|any) /, "");
        if (cleanFood) {
          const restrictionType: RestrictionType = pattern
            .toString()
            .includes("can't|cannot")
            ? "cannot"
            : "willnot";
          restrictions.push({ item: cleanFood, type: restrictionType });
        }
      });
    }
  });

  // Check for specific allergens
  allergens.forEach((allergen) => {
    if (lowerMessage.includes(allergen)) {
      const type: RestrictionType =
        lowerMessage.includes("allerg") ||
        lowerMessage.includes("cannot") ||
        lowerMessage.includes("can't")
          ? "cannot"
          : "willnot";

      // Avoid duplicate entries
      if (!restrictions.some((r) => r.item === allergen)) {
        restrictions.push({ item: allergen, type });
      }
    }
  });

  // Handle specific phrases
  if (lowerMessage.includes("lactose intolerant")) {
    restrictions.push({ item: "dairy", type: "cannot" });
  }

  if (lowerMessage.includes("celiac") || lowerMessage.includes("coeliac")) {
    restrictions.push({ item: "gluten", type: "cannot" });
  }

  return restrictions;
};

const generateBotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("yes") || lowerMessage.includes("allerg")) {
    return "Could you tell me specifically what you're allergic to?";
  }

  if (lowerMessage.includes("no")) {
    return "Are there any foods you prefer not to eat, even if you're not allergic to them?";
  }

  if (
    lowerMessage.includes("prefer not") ||
    lowerMessage.includes("don't like") ||
    lowerMessage.includes("don't eat")
  ) {
    return "I've noted your preferences. Is there anything else you'd like to add?";
  }

  return "Thank you for sharing that. Is there anything else I should know about your dietary preferences?";
};

export default function ChatInterface({
  onUpdateRestrictions,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Process initial message for default restrictions
  useEffect(() => {
    const defaultMessage = initialMessages[1];
    if (defaultMessage && defaultMessage.type === "user") {
      const defaultRestrictions = processResponse(defaultMessage.content);
      if (defaultRestrictions.length > 0) {
        onUpdateRestrictions(defaultRestrictions);
      }
    }
  }, [onUpdateRestrictions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    const messageToSend = inputValue.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
    };

    // Process user response for restrictions
    const newRestrictions = processResponse(messageToSend);
    if (newRestrictions.length > 0) {
      onUpdateRestrictions(newRestrictions);
    }

    // Generate bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: generateBotResponse(messageToSend),
    };

    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInputValue("");

    // Focus the input after sending
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[400px] px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.type === "bot"
                      ? "bg-slate-100 text-slate-900"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="button"
            onClick={handleSendMessage}
            className="shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

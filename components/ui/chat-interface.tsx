import { useState, useRef } from "react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Input } from "./input";
import { Send } from "lucide-react";

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

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      "Hi! I'll help you set up your dietary restrictions. Do you have any food allergies?",
  },
];

const processResponse = (
  message: string
): { item: string; type: "cannot" | "willnot" }[] => {
  const restrictions: { item: string; type: "cannot" | "willnot" }[] = [];
  const lowerMessage = message.toLowerCase();

  // Common allergens to check for
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
  ];

  allergens.forEach((allergen) => {
    if (lowerMessage.includes(allergen)) {
      if (
        lowerMessage.includes("allerg") ||
        lowerMessage.includes("cannot") ||
        lowerMessage.includes("can't")
      ) {
        restrictions.push({ item: allergen, type: "cannot" });
      } else if (
        lowerMessage.includes("prefer not") ||
        lowerMessage.includes("don't like")
      ) {
        restrictions.push({ item: allergen, type: "willnot" });
      }
    }
  });

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
    lowerMessage.includes("don't like")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.value); // Debug log
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    console.log("Sending message:", inputValue); // Debug log
    const messageToSend = inputValue.trim();
    if (!messageToSend) {
      console.log("Message is empty, not sending"); // Debug log
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
    };

    // Process user response for restrictions
    const newRestrictions = processResponse(messageToSend);
    console.log("New restrictions:", newRestrictions); // Debug log
    if (newRestrictions.length > 0) {
      onUpdateRestrictions(newRestrictions);
    }

    // Generate bot response
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: generateBotResponse(messageToSend),
    };

    console.log("Updating messages with:", userMessage, botResponse); // Debug log
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
            onClick={() => {
              console.log("Send button clicked, current input:", inputValue); // Debug log
              handleSendMessage();
            }}
            className="shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Input } from "./input";
import { Send } from "lucide-react";
import { nlpService } from "lib/client/nlp-service";
import {
  storageService,
  type Restriction,
  type Profile,
} from "lib/client/storage-service";

type Message = {
  id: string;
  type: "bot" | "user";
  content: string;
};

type ChatInterfaceProps = {
  profileId: string;
  onUpdateRestrictions: (restrictions: Restriction[]) => void;
};

const generateInitialMessages = (existingRestrictions: boolean): Message[] => {
  if (existingRestrictions) {
    return [
      {
        id: "1",
        type: "bot",
        content:
          "Welcome back! I see you have some dietary restrictions already. Would you like to add or modify any of them?",
      },
    ];
  }

  return [
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'll help you set up your dietary restrictions. Do you have any food allergies or dietary requirements?",
    },
  ];
};

const generateBotResponse = (
  userMessage: string,
  restrictions: Restriction[]
): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Handle empty restrictions after user input
  if (restrictions.length === 0) {
    if (lowerMessage.includes("no") || lowerMessage.includes("none")) {
      return "I understand you don't have any restrictions. Feel free to add any dietary preferences or restrictions at any time.";
    }
    return "I couldn't identify any specific restrictions. Could you please be more specific about your dietary needs?";
  }

  // Get high confidence restrictions
  const highConfidence = restrictions.filter((r) => (r.confidence || 0) >= 0.8);

  if (highConfidence.length > 0) {
    const items = highConfidence.map((r) => r.item).join(", ");
    return `I've noted these restrictions with high confidence: ${items}. Is there anything else I should know about your dietary needs?`;
  }

  // Handle lower confidence restrictions
  const lowConfidence = restrictions.filter((r) => (r.confidence || 0) < 0.8);
  if (lowConfidence.length > 0) {
    const items = lowConfidence.map((r) => r.item).join(", ");
    return `I've noted these potential restrictions: ${items}. Could you confirm if these are correct, and let me know if you have any other dietary needs?`;
  }

  return "Thank you for sharing that. Is there anything else I should know about your dietary preferences?";
};

export default function ChatInterface({
  profileId,
  onUpdateRestrictions,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with existing profile data
  useEffect(() => {
    const initializeChat = () => {
      const profile = storageService.getProfile(profileId);
      if (profile) {
        setCurrentProfile(profile);
        const hasExistingRestrictions = profile.restrictions.length > 0;
        setMessages(generateInitialMessages(hasExistingRestrictions));
        onUpdateRestrictions(profile.restrictions);
      } else {
        // Create new profile if it doesn't exist
        const newProfile = storageService.createProfile(profileId);
        setCurrentProfile(newProfile);
        setMessages(generateInitialMessages(false));
        onUpdateRestrictions([]);
      }
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeChat();
    }
  }, [profileId, onUpdateRestrictions, isInitialized]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const processUserInput = (input: string): Restriction[] => {
    if (!currentProfile) return [];

    // Process input through NLP service
    const newRestrictions = nlpService.processInput(input);

    if (newRestrictions.length > 0) {
      // Merge new restrictions with existing ones
      const existingItems = new Set(
        currentProfile.restrictions.map((r) => r.item)
      );
      const uniqueNewRestrictions = newRestrictions.filter(
        (r) => !existingItems.has(r.item)
      );

      const updatedRestrictions = [
        ...currentProfile.restrictions,
        ...uniqueNewRestrictions,
      ];

      // Update storage and notify parent
      const updatedProfile = storageService.updateProfile(
        profileId,
        updatedRestrictions
      );
      if (updatedProfile) {
        setCurrentProfile(updatedProfile);
        onUpdateRestrictions(updatedProfile.restrictions);
      }

      return newRestrictions;
    }

    return [];
  };

  const handleSendMessage = () => {
    const messageToSend = inputValue.trim();
    if (!messageToSend || !isInitialized) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Process user input and get new restrictions
    const newRestrictions = processUserInput(messageToSend);

    // Generate bot response based on processed restrictions
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: generateBotResponse(messageToSend, newRestrictions),
    };

    // Use setTimeout to ensure messages appear in sequence
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 100);

    setInputValue("");

    // Focus the input after sending
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isInitialized) {
    return null; // Don't render until initialization is complete
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area with ScrollArea component */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6">
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

      {/* Input area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your dietary restrictions..."
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

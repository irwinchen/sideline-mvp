"use client";

import { Restriction } from "./storage-service";
import { restrictionTranslations } from "../translations";

interface ConfidenceRule {
  pattern: RegExp;
  confidence: number;
  type: "cannot" | "willnot";
}

export class NLPService {
  private static instance: NLPService;

  // Common allergens and dietary terms
  private readonly commonTerms = new Set([
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
  ]);

  // Medical condition patterns
  private readonly medicalConditions = new Map<string, string[]>([
    ["celiac", ["gluten", "wheat"]],
    ["coeliac", ["gluten", "wheat"]],
    ["lactose intolerant", ["dairy", "milk"]],
    ["dairy intolerant", ["dairy", "milk"]],
    ["nut allergy", ["peanuts", "tree nuts"]],
    ["shellfish allergy", ["shellfish", "seafood"]],
  ]);

  // Dietary patterns
  private readonly dietaryPatterns = new Map<string, Restriction[]>([
    [
      "kosher",
      [
        { item: "pork", type: "cannot", confidence: 1.0 },
        { item: "shellfish", type: "cannot", confidence: 1.0 },
      ],
    ],
    [
      "halal",
      [
        { item: "pork", type: "cannot", confidence: 1.0 },
        { item: "alcohol", type: "cannot", confidence: 1.0 },
      ],
    ],
    [
      "vegetarian",
      [
        { item: "meat", type: "cannot", confidence: 1.0 },
        { item: "fish", type: "cannot", confidence: 1.0 },
      ],
    ],
    [
      "vegan",
      [
        { item: "meat", type: "cannot", confidence: 1.0 },
        { item: "fish", type: "cannot", confidence: 1.0 },
        { item: "dairy", type: "cannot", confidence: 1.0 },
        { item: "eggs", type: "cannot", confidence: 1.0 },
        { item: "honey", type: "cannot", confidence: 1.0 },
      ],
    ],
  ]);

  // Confidence scoring rules
  private readonly confidenceRules: ConfidenceRule[] = [
    // High confidence patterns
    {
      pattern: /(?:i (?:have|got)(?: a)? .+ allergy)/i,
      confidence: 1.0,
      type: "cannot",
    },
    {
      pattern: /(?:i am|i'm) allergic to/i,
      confidence: 1.0,
      type: "cannot",
    },
    {
      pattern: /(?:diagnosed with|doctor said)/i,
      confidence: 1.0,
      type: "cannot",
    },
    // Medium confidence patterns
    {
      pattern: /(?:i (?:can't|cannot) eat)/i,
      confidence: 0.8,
      type: "cannot",
    },
    {
      pattern: /(?:makes me sick|get sick from)/i,
      confidence: 0.8,
      type: "cannot",
    },
    // Lower confidence patterns
    {
      pattern: /(?:i (?:don't|do not) eat)/i,
      confidence: 0.6,
      type: "willnot",
    },
    {
      pattern: /(?:i avoid|stay away from)/i,
      confidence: 0.6,
      type: "willnot",
    },
    {
      pattern: /(?:i prefer not to eat)/i,
      confidence: 0.4,
      type: "willnot",
    },
  ];

  private constructor() {}

  public static getInstance(): NLPService {
    if (!NLPService.instance) {
      NLPService.instance = new NLPService();
    }
    return NLPService.instance;
  }

  public processInput(input: string): Restriction[] {
    const restrictions: Restriction[] = [];
    const lowerInput = input.toLowerCase();

    // Process medical conditions first
    this.processMedicalConditions(lowerInput, restrictions);

    // Process dietary patterns
    this.processDietaryPatterns(lowerInput, restrictions);

    // Process direct mentions with confidence scoring
    this.processDirectMentions(lowerInput, restrictions);

    // Process patterns with confidence scoring
    this.processConfidencePatterns(input, restrictions);

    // Deduplicate and merge restrictions
    return this.deduplicateRestrictions(restrictions);
  }

  private processMedicalConditions(
    input: string,
    restrictions: Restriction[]
  ): void {
    this.medicalConditions.forEach((items, condition) => {
      if (input.includes(condition)) {
        items.forEach((item) => {
          restrictions.push({
            item,
            type: "cannot",
            confidence: 1.0,
            source: "inference",
          });
        });
      }
    });
  }

  private processDietaryPatterns(
    input: string,
    restrictions: Restriction[]
  ): void {
    this.dietaryPatterns.forEach((items, pattern) => {
      if (input.includes(pattern)) {
        items.forEach((item) => {
          restrictions.push({
            ...item,
            confidence: 0.9,
            source: "inference",
          });
        });
      }
    });
  }

  private processDirectMentions(
    input: string,
    restrictions: Restriction[]
  ): void {
    // Check for translations
    Object.entries(restrictionTranslations).forEach(([item, translations]) => {
      const translatedTerms = [
        item.toLowerCase(),
        translations.es.toLowerCase(),
        translations.zh.toLowerCase(),
        translations.ja.toLowerCase(),
      ];

      if (translatedTerms.some((term) => input.includes(term))) {
        const confidence = this.commonTerms.has(item) ? 0.8 : 0.6;
        restrictions.push({
          item,
          type: this.determineRestrictionType(input),
          confidence,
          source: "user",
        });
      }
    });
  }

  private processConfidencePatterns(
    input: string,
    restrictions: Restriction[]
  ): void {
    this.confidenceRules.forEach((rule) => {
      if (rule.pattern.test(input)) {
        // Extract the specific items mentioned in the matched pattern
        const match = input.match(rule.pattern);
        if (match) {
          const context = this.extractContext(
            input,
            match.index!,
            match[0].length
          );
          const items = this.extractItems(context);

          items.forEach((item) => {
            restrictions.push({
              item,
              type: rule.type,
              confidence: rule.confidence,
              source: "user",
            });
          });
        }
      }
    });
  }

  private determineRestrictionType(input: string): "cannot" | "willnot" {
    const cannotPatterns = [
      /allerg/i,
      /can't eat/i,
      /cannot eat/i,
      /sick/i,
      /intoleran/i,
    ];

    return cannotPatterns.some((pattern) => pattern.test(input))
      ? "cannot"
      : "willnot";
  }

  private extractContext(
    input: string,
    matchIndex: number,
    matchLength: number
  ): string {
    // Get context around the match (5 words before and after)
    const contextStart = input.lastIndexOf(".", matchIndex) + 1 || 0;
    const contextEnd = input.indexOf(".", matchIndex + matchLength);
    return input.slice(
      contextStart,
      contextEnd === -1 ? undefined : contextEnd
    );
  }

  private extractItems(context: string): string[] {
    const items: string[] = [];

    // Split on common conjunctions and punctuation
    const words = context.split(/(?:,|\sand\s|\sor\s|\s&\s)/);

    words.forEach((word) => {
      const cleaned = word.trim().toLowerCase();
      // Match against known terms in translations
      const match = Object.keys(restrictionTranslations).find((term) =>
        cleaned.includes(term.toLowerCase())
      );
      if (match) {
        items.push(match);
      }
    });

    return items;
  }

  private deduplicateRestrictions(restrictions: Restriction[]): Restriction[] {
    const merged = new Map<string, Restriction>();

    restrictions.forEach((restriction) => {
      const existing = merged.get(restriction.item);
      const currentConfidence = restriction.confidence || 0;
      const existingConfidence = existing?.confidence || 0;

      if (!existing || existingConfidence < currentConfidence) {
        merged.set(restriction.item, restriction);
      }
    });

    return Array.from(merged.values());
  }

  // Utility method to get confidence explanation
  public getConfidenceExplanation(restriction: Restriction): string {
    const confidence = restriction.confidence || 0;

    if (confidence >= 0.9) {
      return "High confidence - Medical condition or explicit allergy mentioned";
    } else if (confidence >= 0.7) {
      return "Medium confidence - Clear dietary restriction stated";
    } else if (confidence >= 0.5) {
      return "Lower confidence - Preference or avoidance mentioned";
    } else {
      return "Low confidence - Indirect or unclear mention";
    }
  }
}

export const nlpService = NLPService.getInstance();

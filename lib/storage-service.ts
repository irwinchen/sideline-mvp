"use client";

import { restrictionTranslations } from "./translations";

// Core types
export interface Restriction {
  item: string;
  type: "cannot" | "willnot";
  confidence?: number; // Added for NLP confidence scoring
  source?: "user" | "system" | "inference"; // Track restriction source
}

export interface Profile {
  id: string;
  restrictions: Restriction[]; // Making restrictions required and always an array
  createdAt: Date;
  lastModified: Date;
  language?: string;
}

export interface ProfileView {
  viewedAt: Date;
  language?: string;
  viewerId?: string; // Optional identifier for tracking commercial views
}

const isClient = typeof window !== "undefined";

// In-memory storage implementation
class StorageService {
  private profiles: Map<string, Profile>;
  private profileViews: Map<string, ProfileView[]>;
  private static instance: StorageService;

  private constructor() {
    this.profiles = new Map();
    this.profileViews = new Map();

    if (isClient) {
      // Only attempt to load from localStorage in client-side environment
      this.loadFromLocalStorage();
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Profile Management
  public createProfile(id: string, restrictions: Restriction[] = []): Profile {
    const profile: Profile = {
      id,
      restrictions: restrictions,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    this.profiles.set(id, profile);
    this.syncToLocalStorage();
    return profile;
  }

  public getProfile(id: string): Profile | undefined {
    const profile = this.profiles.get(id);
    if (profile) {
      // Ensure restrictions is always an array
      return {
        ...profile,
        restrictions: profile.restrictions || [],
      };
    }
    return undefined;
  }

  public updateProfile(
    id: string,
    restrictions: Restriction[]
  ): Profile | undefined {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    const updatedProfile: Profile = {
      ...profile,
      restrictions: restrictions,
      lastModified: new Date(),
    };

    this.profiles.set(id, updatedProfile);
    this.syncToLocalStorage();
    return updatedProfile;
  }

  public deleteProfile(id: string): boolean {
    const result = this.profiles.delete(id);
    if (result) {
      this.syncToLocalStorage();
    }
    return result;
  }

  // Profile View Tracking
  public recordProfileView(
    profileId: string,
    language?: string,
    viewerId?: string
  ): void {
    const views = this.profileViews.get(profileId) || [];
    views.push({
      viewedAt: new Date(),
      language,
      viewerId,
    });
    this.profileViews.set(profileId, views);
    this.syncToLocalStorage();
  }

  public getProfileViews(profileId: string): ProfileView[] {
    return this.profileViews.get(profileId) || [];
  }

  // Local Storage Sync
  private syncToLocalStorage(): void {
    if (!isClient) return;

    try {
      // Convert Maps to objects for storage
      const storageData = {
        profiles: Array.from(this.profiles.entries()),
        profileViews: Array.from(this.profileViews.entries()),
        lastSync: new Date().toISOString(),
      };

      localStorage.setItem("sideline_storage", JSON.stringify(storageData));
    } catch (error) {
      console.error("Failed to sync to localStorage:", error);
    }
  }

  public loadFromLocalStorage(): void {
    if (!isClient) return;

    try {
      const storageData = localStorage.getItem("sideline_storage");
      if (!storageData) return;

      const { profiles, profileViews } = JSON.parse(storageData);

      // Restore Maps from stored data
      this.profiles = new Map(
        profiles.map(([id, profile]: [string, any]) => [
          id,
          {
            ...profile,
            restrictions: profile.restrictions || [],
            createdAt: new Date(profile.createdAt),
            lastModified: new Date(profile.lastModified),
          },
        ])
      );

      this.profileViews = new Map(
        profileViews.map(([id, views]: [string, any[]]) => [
          id,
          views.map((view) => ({
            ...view,
            viewedAt: new Date(view.viewedAt),
          })),
        ])
      );
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      // Initialize with empty maps if loading fails
      this.profiles = new Map();
      this.profileViews = new Map();
    }
  }

  // Translation Support
  public getTranslatedRestrictions(
    profileId: string,
    language: string
  ): Array<{ item: string; type: string }> | undefined {
    const profile = this.getProfile(profileId);
    if (!profile) return undefined;

    return profile.restrictions.map((restriction) => ({
      item:
        restrictionTranslations[restriction.item]?.[
          language as keyof (typeof restrictionTranslations)[string]
        ] || restriction.item,
      type: restriction.type,
    }));
  }

  // Utility Methods
  public getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values()).map((profile) => ({
      ...profile,
      restrictions: profile.restrictions || [],
    }));
  }

  public clearAllData(): void {
    this.profiles.clear();
    this.profileViews.clear();
    if (isClient) {
      localStorage.removeItem("sideline_storage");
    }
  }
}

export const storageService = StorageService.getInstance();

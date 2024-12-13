# Sideline MVP 3-Week Project Plan (In-Memory Version)

## Overview

MVP focused on core restriction profile (RP) creation, sharing, and viewing functionality using in-memory storage for rapid prototyping.

## Project Timeline

Total Duration: 3 Weeks

### Week 1: Profile Creation (Part A)

**Days 1-2: Setup & Foundation**

- Set up Next.js project with TypeScript
- Configure TailwindCSS and UI components
- Set up basic routing structure
- Create in-memory store using Map

**Days 3-4: Natural Language Processing**

- Implement chat interface for restriction input
- Create restriction parsing logic
- Build basic restriction token identification
- Implement categorization (cannot eat/will not eat)

**Day 5: Profile Management**

- Create restriction selection interface
- Implement edit/delete functionality
- Add restriction type toggle
- Build profile preview component

### Week 2: Profile Sharing & QR (Part B)

**Days 1-2: Profile Storage**

```typescript
// Simple in-memory store
export const profiles = new Map<
  string,
  {
    id: string;
    restrictions: Array<{
      item: string;
      type: "cannot" | "willnot";
    }>;
    createdAt: Date;
  }
>();

// Profile access history
export const profileViews = new Map<
  string,
  Array<{
    viewedAt: Date;
    language?: string;
  }>
>();
```

**Days 3-4: Link & QR Generation**

- Generate shareable URLs
- Implement QR code generation
- Create QR code display component
- Build basic profile viewer

**Day 5: Email Integration**

- Create mailto: link generation
- Add copy link functionality
- Implement basic email template
- Add share button functionality

### Week 3: Viewing & Translation (Part C)

**Days 1-3: Multilingual Support**

```typescript
// Translation dictionary
const translations = new Map<
  string,
  {
    es: string;
    zh: string;
    ja: string;
  }
>();

// Initialize with core dietary terms
translations.set("peanuts", {
  es: "cacahuetes",
  zh: "花生",
  ja: "ピーナッツ",
});
```

**Days 4-5: Testing & Polish**

- End-to-end testing of core flows
- Mobile testing
- Bug fixes
- Performance optimization

## Technical Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Storage**: In-memory Maps
- **Other**: qrcode.react

## Core Data Structures

```typescript
// In-memory data structures
interface Restriction {
  item: string;
  type: "cannot" | "willnot";
}

interface Profile {
  id: string;
  restrictions: Restriction[];
  createdAt: Date;
}

interface Translation {
  [key: string]: {
    es: string;
    zh: string;
    ja: string;
  };
}
```

## Key Components

```typescript
// Core React components
export function ChatInput({
  onUpdateRestrictions,
}: {
  onUpdateRestrictions: (restrictions: Restriction[]) => void;
}) {
  // Natural language input implementation
}

export function RestrictionsList({
  restrictions,
  onToggleType,
  onRemove,
}: {
  restrictions: Restriction[];
  onToggleType: (item: string) => void;
  onRemove: (item: string) => void;
}) {
  // Editable restrictions list implementation
}

export function QRCode({ profileId }: { profileId: string }) {
  // QR code generation implementation
}

export function TranslatedProfile({
  profile,
  language,
}: {
  profile: Profile;
  language: "en" | "es" | "zh" | "ja";
}) {
  // Translated profile view implementation
}
```

## Minimum Features Required

### Part A: Profile Creation

- Text input field for natural language processing
- Basic categorization of restrictions
- Simple edit interface
- Preview generation
- Link and QR code generation

### Part B: Profile Sharing

- Shareable URL generation
- mailto: link generation
- Mobile-friendly viewing
- Copy to clipboard functionality

### Part C: QR Code Scanning

- QR code display
- Language selection
- Real-time translation
- Mobile-optimized view

## Out of Scope for MVP

- User accounts
- Persistent storage
- Analytics
- Provider features
- Advanced NLP
- Profile templates
- Multiple profiles
- Access tracking
- Rate limiting

## Testing Strategy

- Focus on core user flows
- Mobile device testing
- Translation accuracy verification
- QR code scanning verification

## Deployment Plan

- Deploy to Vercel
- Configure environment variables
- Basic error monitoring

## Success Criteria

- Profile creation works in < 2 minutes
- QR codes scan correctly on major mobile devices
- Translations work for core languages
- Sharing flow works reliably
- System handles demo load

## Risk Mitigation

1. Keep data structures simple
2. Use reliable QR code library
3. Implement basic error handling
4. Keep translations pre-defined
5. Focus on mobile compatibility

## Post-MVP Considerations

- Database integration
- User accounts
- Advanced language processing
- Analytics
- Provider features
- Profile templates

## Daily Checklist Template

```markdown
### Daily Progress Checklist

- [ ] Features implemented
- [ ] Mobile testing completed
- [ ] Translations verified
- [ ] QR codes tested
- [ ] No blocking bugs
```

## Notes on In-Memory Storage

- Profiles reset on server restart
- No persistence between deployments
- Limited to demonstration data
- Suitable for prototype testing
- Fast implementation and iteration

This simplified approach allows us to focus on core functionality and user experience without the overhead of database setup and management. Once the core flows are validated, we can iterate with a proper database implementation.

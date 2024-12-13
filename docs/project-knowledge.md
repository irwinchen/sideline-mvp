# Sideline MVP Project Knowledge Document

## Core Insights & Development Guide

### Key Architectural Decisions

1. **In-Memory Storage**

   - Decision: Use JavaScript Maps for MVP phase
   - Rationale:
     - Faster development cycle
     - Simpler testing and iteration
     - Easier to modify data structures
     - No database setup required
   - Implementation Notes:
     ```typescript
     // Core data structure
     const profiles = new Map<string, Profile>();
     ```
   - Limitations:
     - Data resets on server restart
     - No persistence between deployments
     - Limited to demonstration data

2. **Natural Language Processing**

   - Key Learning: Keep NLP simple but robust
   - Focus Areas:
     - Pattern recognition
     - Confidence scoring
     - Error tolerance
   - Practical Approach:
     - Use predefined patterns
     - Implement confidence scoring
     - Allow for user correction
   - Test Scenarios:
     ```typescript
     // Two primary test cases
     "I'm allergic to peppers and black pepper, and I can't have dairy";
     "I'm vegetarian and keep kosher";
     ```

3. **UI/UX Insights**
   - Chat Interface:
     - Keep responses concise
     - Show confidence levels visually
     - Allow easy correction
   - Profile Display:
     - Group by restriction type
     - Clear visual hierarchy
     - Mobile-first design

### Development Patterns

1. **Component Architecture**

   ```typescript
   // Prefer composition over inheritance
   function ProfileView({ restrictions, editable }) {
     return (
       <RestrictionsDisplay restrictions={restrictions}>
         {editable && <EditControls />}
       </RestrictionsDisplay>
     );
   }
   ```

2. **State Management**

   - Keep state close to where it's used
   - Use context sparingly
   - Implement clear update patterns

3. **Error Handling**
   - Graceful degradation for NLP
   - Clear user feedback
   - Easy correction paths

### MVP Focus Areas

1. **Part A: Profile Creation**

   - Core Functionality:
     - Natural language input
     - Pattern recognition
     - Basic editing
   - Implementation Priority:
     ```typescript
     // Process flow
     input -> NLP -> suggestions -> confirmation -> profile
     ```

2. **Part B: Profile Sharing**

   - Core Features:
     - URL generation
     - Email sharing
     - QR code display
   - Technical Notes:
     - Use QR code library
     - Simple mailto: links
     - Basic validation

3. **Part C: Profile Viewing**
   - Essential Elements:
     - Mobile view
     - Language switching
     - QR scanning
   - Implementation Tips:
     - Pre-built translations
     - Responsive design
     - Progressive enhancement

### Learned Optimization Patterns

1. **NLP Processing**

   ```typescript
   // Efficient pattern matching
   const PATTERNS = {
     medical: [/allergic to (\w+)/i],
     dietary: [/vegetarian/i, /vegan/i],
     religious: [/kosher/i, /halal/i],
   };
   ```

2. **Profile Updates**

   ```typescript
   // Efficient restriction updates
   function updateRestrictions(prev: Restriction[], new: Restriction[]) {
     return new Map([...prev, ...new]); // Automatic deduplication
   }
   ```

3. **Memory Management**
   - Clear temporary data
   - Limit history size
   - Implement cleanup routines

### Testing Strategy

1. **Core Test Cases**

   ```typescript
   const testCases = [
     {
       input: "I'm allergic to peppers and black pepper",
       expectedRestrictions: [
         { item: "peppers", type: "cannot" },
         { item: "black pepper", type: "cannot" },
       ],
     },
     {
       input: "I'm vegetarian and keep kosher",
       expectedRestrictions: [
         { item: "meat", type: "cannot" },
         { item: "pork", type: "cannot" },
         { item: "shellfish", type: "cannot" },
       ],
     },
   ];
   ```

2. **Edge Cases**

   - Empty input handling
   - Duplicate restrictions
   - Conflicting information
   - Language mixing

3. **User Flow Testing**
   - Profile creation path
   - Sharing mechanics
   - QR code scanning
   - Translation accuracy

### Performance Considerations

1. **Response Times**

   - NLP processing < 100ms
   - Profile load < 200ms
   - QR generation < 100ms

2. **Memory Usage**

   - Limit profile size
   - Cleanup old sessions
   - Monitor Map sizes

3. **Mobile Optimization**
   - Lazy load components
   - Optimize for touch
   - Minimize animations

### Security Notes

1. **Profile Access**

   - Use random IDs
   - Implement view tracking
   - Basic rate limiting

2. **Data Validation**
   - Sanitize input
   - Validate restrictions
   - Check translations

### Development Workflow

1. **Setup**

   ```bash
   # Initial setup
   git clone <repo>
   npm install
   npm run dev
   ```

2. **Testing Flow**

   - Unit test NLP
   - Test core flows
   - Mobile testing
   - Translation verification

3. **Deployment Checklist**
   - Verify all test cases
   - Check mobile views
   - Test QR scanning
   - Verify translations

### Known Limitations

1. **Technical Constraints**

   - No persistence
   - Limited history
   - Basic NLP
   - Fixed translations

2. **User Experience**
   - No offline mode
   - Simple sharing
   - Basic editing
   - Limited languages

### Next Phase Considerations

1. **Database Integration**

   - Plan data structure
   - Consider migration
   - Define indexes

2. **Enhanced Features**

   - Advanced NLP
   - More languages
   - Offline support
   - Analytics

3. **Scale Preparation**
   - Database design
   - Caching strategy
   - API versioning
   - Monitoring setup

This document serves as a living guide for MVP development. Update it as new patterns and insights emerge during development.

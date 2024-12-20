# Sideline Project Session Notes
November 27, 2024

## Overview
Building ingredient database for Sideline food restriction app

## Actions Completed

1. Research Phase
- Analyzed FDA GRAS database structure
- Identified OpenFDA API as primary data source
- Created Food_DB_Research.md with findings
- Obtained OpenFDA API key

2. File Structure Setup
```
/users/irwinchen/apps/mcp/
├── Food_DB_Research.md
├── keys.md
├── test_api.js
├── download_data.js
├── transform_data.js
└── index.js
```

3. API Integration
- Created test_api.js for API verification
- Set up download_data.js for bulk data retrieval
- Implemented transform_data.js for data processing

4. Schema Design
```typescript
interface Ingredient {
  id: string;
  name: string;
  unii: string;
  category: string[];
  restrictions: {
    allergen: boolean;
    kosher: boolean;
    halal: boolean;
    vegan: boolean;
  };
  crossContamination: string[];
  translations: Record<string, string>;
}
```

## Next Steps

1. Database Setup
- Install PostgreSQL
- Create sideline database
- Set up users and permissions
- Implement schema

2. ETL Pipeline
- Complete data download scripts
- Transform FDA data to our schema
- Load into PostgreSQL
- Set up daily updates

3. Enrichment Phase
- Add religious certification data
- Implement allergen classifications
- Add translations
- Create hierarchical relationships

## Credentials
OpenFDA API Key: sp8HydAYLUSiyq72WgWrOEIBxdbe51AmOSxDMZQg
Rate Limits: 240 requests/minute, 120,000 requests/day

## Dependencies Added
- node-fetch
- fs/promises
- zlib
- stream/promises
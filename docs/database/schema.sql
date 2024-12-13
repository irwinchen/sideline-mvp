-- Core ingredient information
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    scientific_name TEXT,
    description TEXT,
    category TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Major allergen categories
CREATE TABLE allergen_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    severity_level TEXT,
    fda_major_allergen BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

-- Specific allergens within categories
CREATE TABLE allergens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES allergen_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB
);

-- Ingredient allergen relationships
CREATE TABLE ingredient_allergens (
    ingredient_id UUID REFERENCES ingredients(id),
    allergen_id UUID REFERENCES allergens(id),
    relationship_type TEXT, -- 'contains', 'may_contain', 'produced_in_facility_with'
    confidence_level INTEGER, -- 1-5 scale
    source TEXT,
    metadata JSONB,
    PRIMARY KEY (ingredient_id, allergen_id)
);

-- Dietary restriction categories
CREATE TABLE dietary_restriction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT, -- 'medical', 'religious', 'lifestyle'
    description TEXT,
    metadata JSONB
);

-- Specific restrictions within categories
CREATE TABLE dietary_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES dietary_restriction_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB
);

-- Ingredient restriction relationships
CREATE TABLE ingredient_restrictions (
    ingredient_id UUID REFERENCES ingredients(id),
    restriction_id UUID REFERENCES dietary_restrictions(id),
    relationship_type TEXT, -- 'forbidden', 'cautionary', 'depends_on_preparation'
    notes TEXT,
    metadata JSONB,
    PRIMARY KEY (ingredient_id, restriction_id)
);

-- Derivative ingredients mapping
CREATE TABLE ingredient_derivatives (
    parent_id UUID REFERENCES ingredients(id),
    derivative_id UUID REFERENCES ingredients(id),
    process_description TEXT,
    allergen_retained BOOLEAN,
    metadata JSONB,
    PRIMARY KEY (parent_id, derivative_id)
);

-- Alternative names and industry terms
CREATE TABLE ingredient_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID REFERENCES ingredients(id),
    alias TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    context TEXT, -- 'common_name', 'industry_term', 'international_name'
    metadata JSONB
);

-- Certification requirements
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT, -- 'kosher', 'halal', 'gluten_free', etc.
    description TEXT,
    metadata JSONB
);

-- Ingredient certification requirements
CREATE TABLE ingredient_certifications (
    ingredient_id UUID REFERENCES ingredients(id),
    certification_id UUID REFERENCES certifications(id),
    requirement_type TEXT, -- 'required', 'optional', 'conditional'
    conditions TEXT,
    metadata JSONB,
    PRIMARY KEY (ingredient_id, certification_id)
);

-- Create indexes
CREATE INDEX idx_ingredients_name ON ingredients USING gin (to_tsvector('english', name));
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_allergens_name ON allergens(name);
CREATE INDEX idx_ingredient_aliases_alias ON ingredient_aliases USING gin (to_tsvector('english', alias));
CREATE INDEX idx_ingredient_allergens_confidence ON ingredient_allergens(confidence_level);

-- Natural Language Processing Support
CREATE TABLE common_phrases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phrase TEXT NOT NULL,
    normalized_phrase TEXT NOT NULL,
    category TEXT NOT NULL, -- 'allergy', 'intolerance', 'preference', 'medical'
    confidence_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(normalized_phrase)
);

CREATE TABLE phrase_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phrase_id UUID REFERENCES common_phrases(id),
    mapped_allergens UUID[] REFERENCES allergens(id)[],
    mapped_restrictions UUID[] REFERENCES dietary_restrictions(id)[],
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profile Management
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE, -- from auth system
    email TEXT,
    phone TEXT,
    display_name TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES user_profiles(id),
    restriction_type TEXT NOT NULL, -- 'allergen', 'dietary', 'preference'
    restriction_id UUID, -- references either allergens or dietary_restrictions
    severity TEXT NOT NULL, -- 'fatal', 'severe', 'moderate', 'mild', 'preference'
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile Sharing
CREATE TABLE share_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES user_profiles(id),
    token TEXT UNIQUE NOT NULL,
    name TEXT, -- optional name for the share (e.g., "Restaurant Token")
    scope TEXT[], -- array of allowed access scopes
    expires_at TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES user_profiles(id),
    token_id UUID REFERENCES share_tokens(id),
    accessed_by TEXT, -- could be IP, device ID, or commercial account
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    access_type TEXT, -- 'view', 'scan', 'api'
    metadata JSONB
);

-- Default Combinations (for smart suggestions)
CREATE TABLE restriction_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    allergens UUID[] REFERENCES allergens(id)[],
    restrictions UUID[] REFERENCES dietary_restrictions(id)[],
    confidence_score FLOAT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_common_phrases_normalized ON common_phrases(normalized_phrase);
CREATE INDEX idx_user_restrictions_profile ON user_restrictions(profile_id);
CREATE INDEX idx_share_tokens_token ON share_tokens(token);
CREATE INDEX idx_access_logs_profile ON access_logs(profile_id);
CREATE INDEX idx_phrase_mappings_phrase ON phrase_mappings(phrase_id);

-- Example data for common phrases
INSERT INTO common_phrases (phrase, normalized_phrase, category, confidence_score) VALUES
('I''m allergic to peanuts', 'allergy peanuts', 'allergy', 1.0),
('I can''t eat gluten', 'celiac gluten intolerance', 'medical', 1.0),
('I''m vegetarian', 'vegetarian', 'preference', 1.0),
('No dairy please', 'dairy free lactose', 'intolerance', 0.9);

-- Example restriction combination
INSERT INTO restriction_combinations (name, description, confidence_score) VALUES
('Strict Vegetarian', 'No meat, fish, or animal products', 1.0),
('Kosher Basic', 'Basic kosher dietary restrictions', 1.0),
('Celiac Safe', 'No gluten or common cross-contamination risks', 1.0);
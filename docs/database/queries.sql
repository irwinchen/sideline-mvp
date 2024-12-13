-- 1. Process Natural Language Input
-- When user types "I'm allergic to peanuts and can't have dairy"
WITH normalized_input AS (
    SELECT regexp_split_to_table(
        lower('im allergic to peanuts and cant have dairy'),
        '\s+'
    ) AS word
),
matching_phrases AS (
    SELECT cp.id, cp.phrase, cp.category, 
           similarity(cp.normalized_phrase, string_agg(word, ' ')) as match_score
    FROM normalized_input
    CROSS JOIN common_phrases cp
    GROUP BY cp.id, cp.phrase, cp.category
    HAVING similarity(cp.normalized_phrase, string_agg(word, ' ')) > 0.3
    ORDER BY match_score DESC
    LIMIT 5
)
SELECT 
    mp.phrase,
    mp.category,
    a.name as allergen_name,
    dr.name as restriction_name
FROM matching_phrases mp
LEFT JOIN phrase_mappings pm ON mp.id = pm.phrase_id
LEFT JOIN allergens a ON a.id = ANY(pm.mapped_allergens)
LEFT JOIN dietary_restrictions dr ON dr.id = ANY(pm.mapped_restrictions);

-- 2. Create User Profile with Restrictions
WITH new_profile AS (
    INSERT INTO user_profiles (user_id, email, display_name)
    VALUES ('auth0|123', 'user@example.com', 'John Doe')
    RETURNING id
),
allergen_restrictions AS (
    INSERT INTO user_restrictions (
        profile_id,
        restriction_type,
        restriction_id,
        severity,
        notes
    )
    SELECT 
        new_profile.id,
        'allergen',
        a.id,
        'severe',
        'User indicated severe peanut allergy'
    FROM new_profile
    CROSS JOIN (SELECT id FROM allergens WHERE name = 'peanuts') a
    RETURNING id
),
dietary_restrictions AS (
    INSERT INTO user_restrictions (
        profile_id,
        restriction_type,
        restriction_id,
        severity,
        notes
    )
    SELECT 
        new_profile.id,
        'dietary',
        dr.id,
        'moderate',
        'Lactose intolerance indicated'
    FROM new_profile
    CROSS JOIN (SELECT id FROM dietary_restrictions WHERE name = 'dairy-free') dr
    RETURNING id
)
SELECT * FROM new_profile;

-- 3. Generate Share Token/QR Code
WITH new_token AS (
    INSERT INTO share_tokens (
        profile_id,
        token,
        name,
        scope,
        expires_at,
        max_uses
    )
    SELECT 
        p.id,
        encode(sha256(random()::text::bytea), 'hex'),
        'Restaurant QR Code',
        ARRAY['view', 'scan'],
        NOW() + INTERVAL '1 year',
        NULL
    FROM user_profiles p
    WHERE p.user_id = 'auth0|123'
    RETURNING id, token
)
SELECT token FROM new_token;

-- 4. Lookup Profile via Share Token
WITH token_check AS (
    SELECT 
        st.profile_id,
        st.id as token_id
    FROM share_tokens st
    WHERE st.token = 'example_token'
    AND (st.expires_at IS NULL OR st.expires_at > NOW())
    AND (st.max_uses IS NULL OR st.current_uses < st.max_uses)
    AND st.revoked_at IS NULL
),
access_log_entry AS (
    INSERT INTO access_logs (
        profile_id,
        token_id,
        accessed_by,
        access_type,
        metadata
    )
    SELECT 
        tc.profile_id,
        tc.token_id,
        'restaurant_device_123',
        'scan',
        jsonb_build_object(
            'device_type', 'ios',
            'app_version', '1.0.0',
            'location', 'New York, NY'
        )
    FROM token_check tc
    RETURNING profile_id
)
SELECT 
    up.display_name,
    ur.severity,
    CASE 
        WHEN ur.restriction_type = 'allergen' THEN a.name
        WHEN ur.restriction_type = 'dietary' THEN dr.name
    END as restriction,
    ur.notes
FROM access_log_entry ale
JOIN user_profiles up ON ale.profile_id = up.id
JOIN user_restrictions ur ON up.id = ur.profile_id
LEFT JOIN allergens a ON ur.restriction_id = a.id AND ur.restriction_type = 'allergen'
LEFT JOIN dietary_restrictions dr ON ur.restriction_id = dr.id AND ur.restriction_type = 'dietary'
WHERE ur.active = true;

-- 5. Update User Restrictions
WITH updated_restriction AS (
    UPDATE user_restrictions
    SET 
        severity = 'mild',
        notes = 'Updated severity level based on user input',
        updated_at = NOW()
    WHERE profile_id = (
        SELECT id 
        FROM user_profiles 
        WHERE user_id = 'auth0|123'
    )
    AND restriction_id = (
        SELECT id 
        FROM allergens 
        WHERE name = 'peanuts'
    )
    RETURNING *
)
SELECT * FROM updated_restriction;

-- 6. Get Popular Combinations for Suggestions
WITH user_input_categories AS (
    SELECT DISTINCT category 
    FROM common_phrases 
    WHERE normalized_phrase ILIKE '%vegetarian%'
),
relevant_combinations AS (
    SELECT 
        rc.*,
        similarity(
            array_to_string(rc.restrictions::text[], ' '),
            'vegetarian'
        ) as match_score
    FROM restriction_combinations rc
    JOIN user_input_categories uic 
        ON rc.name ILIKE '%' || uic.category || '%'
    WHERE rc.confidence_score > 0.8
    ORDER BY rc.usage_count DESC, match_score DESC
    LIMIT 5
)
SELECT 
    rc.name,
    rc.description,
    array_agg(DISTINCT a.name) as allergens,
    array_agg(DISTINCT dr.name) as dietary_restrictions
FROM relevant_combinations rc
LEFT JOIN allergens a ON a.id = ANY(rc.allergens)
LEFT JOIN dietary_restrictions dr ON dr.id = ANY(rc.restrictions)
GROUP BY rc.id, rc.name, rc.description;
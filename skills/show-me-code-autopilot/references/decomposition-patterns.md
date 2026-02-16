# Decomposition Patterns

## Purpose

This document defines common task decomposition patterns for auto-breaking down requirements into executable tasks.

## Decomposition Strategies

### 1. Vertical Slicing (Preferred)

Split tasks by user value path from UI to data:

```
User Request: "Add user profile feature"
→ TASK-001: Create profile database schema
→ TASK-002: Implement profile API endpoints
→ TASK-003: Build profile UI components
→ TASK-004: Connect UI to API with state management
```

**When to use:**
- Feature with clear user-facing components
- When early user validation is valuable
- When UI and API can be developed incrementally

### 2. Risk-First Decomposition

Prioritize high-risk and high-uncertainty tasks:

```
User Request: "Implement OAuth authentication"
→ TASK-001: Research and select OAuth provider (HIGH RISK)
→ TASK-002: Set up OAuth callback infrastructure (HIGH RISK)
→ TASK-003: Implement token storage and refresh
→ TASK-004: Build login/logout UI
```

**When to use:**
- Integrating new technologies
- Unknown technical feasibility
- External dependencies

### 3. Independent Feature Decomposition

Split into independently testable and committable units:

```
User Request: "Add comment system"
→ TASK-001: Create comment data model
→ TASK-002: Implement CRUD API for comments
→ TASK-003: Add comment list component
→ TASK-004: Add comment form component
→ TASK-005: Implement comment notifications
```

**When to use:**
- Features with multiple sub-features
- When incremental delivery is acceptable
- Each sub-feature can be tested independently

### 4. Dependency Chain Decomposition

Identify and sequence by explicit dependencies:

```
User Request: "Add file upload feature"
→ TASK-001: Set up file storage backend (no dependencies)
→ TASK-002: Implement upload API endpoint (depends on TASK-001)
→ TASK-003: Create upload UI component (depends on TASK-002)
→ TASK-004: Add progress tracking (depends on TASK-002)
→ TASK-005: Implement file listing/deletion (depends on TASK-002)
```

**When to use:**
- Clear technical dependencies exist
- Infrastructure must precede features
- Data flow is unidirectional

## Common Pattern Templates

### CRUD Feature Template

```yaml
# For creating a new CRUD resource (e.g., "Product", "Article")
tasks:
  - id: TASK-001
    title: "Create [Resource] data model and migration"
    state: todo
    depends_on: []
    acceptance:
      - "Database table for [Resource] exists"
      - "Migration script runs successfully"
    risk: low
    files_hint: ["db/migrations/*", "src/models/[Resource].ts"]

  - id: TASK-002
    title: "Implement [Resource] CRUD API endpoints"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "GET /api/[resource] returns list"
      - "GET /api/[resource]/:id returns single item"
      - "POST /api/[resource] creates item"
      - "PUT /api/[resource]/:id updates item"
      - "DELETE /api/[resource]/:id deletes item"
    risk: medium
    files_hint: ["src/api/[Resource].ts"]

  - id: TASK-003
    title: "Build [Resource] list UI component"
    state: todo
    depends_on: [TASK-002]
    acceptance:
      - "List renders with pagination"
      - "Each item displays key fields"
      - "Loading states handled"
    risk: low
    files_hint: ["src/components/[Resource]List.tsx"]

  - id: TASK-004
    title: "Build [Resource] form UI component"
    state: todo
    depends_on: [TASK-002]
    acceptance:
      - "Form validates required fields"
      - "Submit creates/updates via API"
      - "Error messages displayed on failure"
    risk: low
    files_hint: ["src/components/[Resource]Form.tsx"]
```

### Authentication Feature Template

```yaml
# For adding authentication/authorization
tasks:
  - id: TASK-001
    title: "Research authentication strategy"
    state: todo
    depends_on: []
    acceptance:
      - "Document compared 2+ auth options"
      - - "Decision recorded with rationale"
    risk: high
    files_hint: [".autopilot/decision-log.md"]

  - id: TASK-002
    title: "Implement authentication backend"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "User registration endpoint works"
      - "Login endpoint returns valid token"
      - "Token verification middleware exists"
    risk: high
    files_hint: ["src/api/auth.ts", "src/middleware/auth.ts"]

  - id: TASK-003
    title: "Build authentication UI"
    state: todo
    depends_on: [TASK-002]
    acceptance:
      - "Login/register forms exist"
      - "Token stored on successful auth"
      - "Protected routes redirect to login"
    risk: medium
    files_hint: ["src/components/LoginForm.tsx", "src/components/RegisterForm.tsx"]

  - id: TASK-004
    title: "Add session management"
    state: todo
    depends_on: [TASK-003]
    acceptance:
      - "Token refresh implemented"
      - "Logout clears session"
      - "Expired tokens handled gracefully"
    risk: medium
    files_hint: ["src/utils/auth.ts"]
```

### UI Component Template

```yaml
# For adding a new UI component
tasks:
  - id: TASK-001
    title: "Design [Component] API and props interface"
    state: todo
    depends_on: []
    acceptance:
      - "Props interface documented"
      - "Component contract defined"
    risk: low
    files_hint: ["src/components/[Component].tsx"]

  - id: TASK-002
    title: "Implement [Component] base functionality"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "Component renders with required props"
      - "Basic interaction works"
      - "Accessibility attributes present"
    risk: low
    files_hint: ["src/components/[Component].tsx"]

  - id: TASK-003
    title: "Add [Component] styling and variants"
    state: todo
    depends_on: [TASK-002]
    acceptance:
      - "All visual variants render correctly"
      - "Responsive behavior verified"
      - "Dark mode support if applicable"
    risk: low
    files_hint: ["src/components/[Component].tsx", "src/components/[Component].css"]

  - id: TASK-004
    title: "Write unit tests for [Component]"
    state: todo
    depends_on: [TASK-003]
    acceptance:
      - "All props combinations tested"
      - "Interaction events verified"
      - "Edge cases covered"
    risk: low
    files_hint: ["src/components/[Component].test.tsx"]
```

### API Integration Template

```yaml
# For integrating with external API
tasks:
  - id: TASK-001
    title: "Research external API and auth strategy"
    state: todo
    depends_on: []
    acceptance:
      - "API documentation reviewed"
      - "Authentication method determined"
      - "Rate limits and constraints documented"
    risk: high
    files_hint: [".autopilot/decision-log.md"]

  - id: TASK-002
    title: "Set up API client and authentication"
    state: todo
    depends_on: [TASK-001]
    acceptance:
      - "API client configured"
      - "Authentication flow working"
      - "Error handling implemented"
    risk: medium
    files_hint: ["src/api/externalClient.ts"]

  - id: TASK-003
    title: "Implement core API integration endpoints"
    state: todo
    depends_on: [TASK-002]
    acceptance:
      - "Required endpoints called successfully"
      - "Data transformation layer exists"
      - "Caching strategy if needed"
    risk: medium
    files_hint: ["src/api/externalService.ts"]

  - id: TASK-004
    title: "Build UI for external data display"
    state: todo
    depends_on: [TASK-003]
    acceptance:
      - "External data renders in UI"
      - "Loading states handled"
      - "Error states displayed"
    risk: low
    files_hint: ["src/components/ExternalData.tsx"]
```

## Task Splitting Rules

### When to Split Further

A task needs splitting if ANY of these apply:

1. **Too large**: Estimated effort > 2 hours
2. **Vague acceptance**: Cannot write testable pass conditions
3. **Mixed concerns**: Touches >3 major modules
4. **Hidden dependencies**: Contains sub-steps with their own dependencies
5. **High risk single point**: Single task blocks many others

### Splitting Heuristics

```
Original: "Build full e-commerce checkout"
→ Split into:
   - TASK-001: Create checkout data model
   - TASK-002: Implement checkout API
   - TASK-003: Build shipping address form
   - TASK-004: Build payment form
   - TASK-005: Implement order confirmation flow
```

## Anti-Patterns to Avoid

### Don't split by file
```
❌ Bad:
   - TASK-001: Write auth.ts
   - TASK-002: Write user.ts
   - TASK-003: Write database.ts

✅ Good:
   - TASK-001: Implement user registration
   - TASK-002: Implement user login
   - TASK-003: Implement password reset
```

### Don't split by layer
```
❌ Bad:
   - TASK-001: Write all database queries
   - TASK-002: Write all API endpoints
   - TASK-003: Write all UI components

✅ Good:
   - TASK-001: Implement user profile feature (DB + API + UI)
   - TASK-002: Implement settings feature (DB + API + UI)
```

### Don't create artificial dependencies
```
❌ Bad:
   - TASK-001: Setup project structure
   - TASK-002: Create utils folder (depends on TASK-001)
   - TASK-003: Create components folder (depends on TASK-002)

✅ Good:
   - TASK-001: Implement feature A
   - TASK-002: Implement feature B (truly independent)
```

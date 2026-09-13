# Testing Guide — Vibe Check

## Overview

This project uses **Vitest** for unit testing utility functions and core logic. Tests are organized alongside source files in `__tests__` directories.

## Setup

### Install Test Dependencies

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

### Configuration

The project includes a `vitest.config.ts` at the root:
- Environment: Node
- Module aliases configured for `@` imports
- Coverage reporter configured for v8

## Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode
```bash
npm test -- --watch
```

### UI Dashboard
```bash
npm run test:ui
```

Opens a browser dashboard to run tests interactively and see results.

### Coverage Report
```bash
npm run test:coverage
```

Generates a coverage report in the `coverage/` directory.

## Test Structure

Tests are located in `__tests__` folders alongside the code they test:

```
src/
├── lib/
│   ├── record.ts
│   ├── __tests__/
│   │   ├── record.test.ts
│   │   ├── avatar.test.ts
│   │   ├── utils.test.ts
│   ├── session/
│   │   ├── storage.ts
│   │   ├── __tests__/
│   │   │   ├── storage.test.ts
│   │   │   └── progress.test.ts
│   ├── i18n/
│   │   ├── format.ts
│   │   ├── __tests__/
│   │   │   └── format.test.ts
│   └── ...
├── modules/
│   └── tech/
│       └── server/
│           ├── scorer.ts
│           └── __tests__/
│               └── scorer.test.ts
```

## Test Coverage

### Utility Functions

#### `src/lib/record.ts` — `getOwn()`
Safe property access that prevents prototype pollution attacks.

**Test cases:**
- Retrieving existing keys
- Handling missing keys
- Avoiding prototype properties (`constructor`, `__proto__`, `inherited`)
- Working with null prototypes
- Falsy values (0, '', false, null)

#### `src/lib/avatar.ts` — `personaAvatar()`
Avatar generation with domain-specific characters or fallbacks.

**Test cases:**
- Tech domain returns Dok character
- Unknown domains fall back gracefully
- Seed reproducibility
- Different seeds produce different avatars
- Empty seed handling

#### `src/lib/utils.ts` — `cn()`
Class name utility (Clsx + Tailwind Merge) for conditional CSS.

**Test cases:**
- Concatenating strings
- Filtering falsy values
- Object-based conditionals
- Array handling
- Tailwind conflict resolution
- Nested conditions

### Session Logic

#### `src/lib/session/storage.ts`
Session persistence to `sessionStorage` and `localStorage`.

**Test cases:**
- Saving and loading complete sessions
- Handling missing sessions
- Session with turns and pending answers
- Corrupt data recovery
- Session count management
- Session idempotency

#### `src/lib/session/progress.ts` (Hearts System)
Client-side progress cue based on answer quality.

**Test cases:**
- Starting with max hearts
- Losing hearts for weak answers (score < 50%)
- Keeping hearts for strong answers
- Multiple weak answers
- Never going below 0 hearts
- Ignoring unevaluated turns
- Zero max-score edge case

### i18n

#### `src/lib/i18n/format.ts` — `formatMessage()`
Simple placeholder replacement for message formatting.

**Test cases:**
- Messages without placeholders
- Single and multiple replacements
- Type coercion (numbers, booleans)
- Case-sensitive matching
- Missing parameters
- Special characters in replacements
- Unicode support
- Repeated placeholders

### Scoring Logic

#### `src/modules/tech/server/scorer.ts`
Deterministic answer evaluation based on expected key point coverage.

**Test cases:**
- Perfect answer (all key points covered)
- Partial answers
- Blank answers
- Case-insensitive matching
- Proportional scoring
- Single and zero key points
- Deterministic evaluation
- Long answers with multiple points
- Knowledge gap identification

## Writing Tests

### Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../file';

describe('function name', () => {
  it('should do something', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    const result = functionToTest(edge);
    expect(result).toEqual(expectedValue);
  });
});
```

### Best Practices

1. **Name tests clearly**: Use "should" or "returns/handles" pattern
   - ✅ `it('returns value for existing key')`
   - ❌ `it('test getOwn')`

2. **Test one thing per test**: Each `it` should verify one behavior

3. **Use descriptive matchers**:
   - `toBe()` for primitives
   - `toEqual()` for objects/arrays
   - `toContain()` for collections
   - `toMatch()` for strings/regex

4. **Test edge cases**: null, undefined, empty, zero, large values

5. **Mock external state**: Use `beforeEach`/`afterEach` for setup/teardown

## What's Not Yet Tested

These require additional dependencies or setup:

- **Component tests**: React Testing Library (for UI components)
- **API routes**: Integration tests with mocked database
- **E2E tests**: Playwright (for user flows)
- **Performance tests**: Benchmarks for critical paths

## Future Additions

- Add React Testing Library for component tests (chat-pane, options list, etc.)
- Add integration tests for API routes
- Add E2E tests for full user interview flow
- Add performance benchmarks for scorer evaluation

## Continuous Integration

Recommended CI setup:

```yaml
test:
  script: npm test -- --coverage
  coverage: '/Coverage: \d+\.\d+%/'
```

Fail the build if coverage drops below 80% for core utilities.

## Troubleshooting

### Tests not found
- Ensure file names match `*.test.ts` pattern
- Check `vitest.config.ts` includes the right glob

### Import errors
- Use `@` alias: `import { fn } from '@/lib/file'`
- Vitest config auto-resolves aliases

### Timeout errors
- Increase timeout: `it('test', async () => {}, { timeout: 10000 })`
- For mocked storage, check mock setup in beforeEach

## Resources

- [Vitest Docs](https://vitest.dev/)
- [Expect API](https://vitest.dev/api/expect.html)
- [Matchers Reference](https://vitest.dev/api/)

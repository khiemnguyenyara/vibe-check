import { describe, it, expect } from 'vitest';
import { formatMessage } from '../format';

describe('formatMessage', () => {
  it('returns message as-is when no placeholders', () => {
    const message = 'Hello, world!';
    const result = formatMessage(message, {});
    expect(result).toBe(message);
  });

  it('replaces single placeholder', () => {
    const message = 'Hello, {name}!';
    const result = formatMessage(message, { name: 'Alice' });
    expect(result).toBe('Hello, Alice!');
  });

  it('replaces multiple placeholders', () => {
    const message = '{greeting}, {name}! You have {count} messages.';
    const result = formatMessage(message, {
      greeting: 'Hi',
      name: 'Bob',
      count: '5',
    });
    expect(result).toBe('Hi, Bob! You have 5 messages.');
  });

  it('handles number and boolean values', () => {
    const message = 'Score: {score}, Complete: {done}';
    const result = formatMessage(message, {
      score: 42,
      done: true,
    });
    expect(result).toBe('Score: 42, Complete: true');
  });

  it('ignores unused parameters', () => {
    const message = 'Hello {name}';
    const result = formatMessage(message, {
      name: 'Charlie',
      unused: 'ignored',
    });
    expect(result).toBe('Hello Charlie');
  });

  it('ignores missing parameters', () => {
    const message = 'Hello {name}, you are {age} years old';
    const result = formatMessage(message, { name: 'Dave' });
    expect(result).toBe('Hello Dave, you are {age} years old');
  });

  it('handles special characters in replacement', () => {
    const message = 'Pattern: {pattern}';
    const result = formatMessage(message, {
      pattern: '[a-zA-Z0-9]',
    });
    expect(result).toBe('Pattern: [a-zA-Z0-9]');
  });

  it('handles curly braces in replacement', () => {
    const message = 'Code: {code}';
    const result = formatMessage(message, {
      code: '{ key: "value" }',
    });
    expect(result).toBe('Code: { key: "value" }');
  });

  it('handles empty string values', () => {
    const message = 'Hello {name}!';
    const result = formatMessage(message, { name: '' });
    expect(result).toBe('Hello !');
  });

  it('case-sensitive placeholder matching', () => {
    const message = 'Hello {Name}';
    const result = formatMessage(message, { name: 'lowercase' });
    expect(result).toBe('Hello {Name}');
  });

  it('handles repeated placeholders', () => {
    const message = '{x} + {x} = 2 * {x}';
    const result = formatMessage(message, { x: '5' });
    expect(result).toBe('5 + 5 = 2 * 5');
  });

  it('handles nested-like braces (not actual nesting)', () => {
    const message = 'Format: {{text}} with {key}';
    const result = formatMessage(message, { key: 'value' });
    // Should replace {key} but leave {{text}} as-is or handle it
    expect(result).toContain('value');
  });

  it('handles unicode in placeholders', () => {
    const message = 'Xin chào {tên}';
    const result = formatMessage(message, { tên: 'Tuấn' });
    expect(result).toBe('Xin chào Tuấn');
  });
});

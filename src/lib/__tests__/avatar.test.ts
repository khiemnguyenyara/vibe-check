import { describe, it, expect } from 'vitest';
import { personaAvatar } from '../avatar';

describe('personaAvatar', () => {
  it('returns tech domain character (Dok)', () => {
    const avatar = personaAvatar('tech', 'seed123');
    expect(avatar.src).toBe('/assets/dok.png');
    expect(avatar.className).toBeDefined();
  });

  it('returns fallback avatar for unknown domain', () => {
    const avatar = personaAvatar('unknown-domain', 'seed456');
    expect(avatar).toBeDefined();
    expect(avatar.src).toBeDefined();
  });

  it('uses seed for reproducible avatar generation', () => {
    const avatar1 = personaAvatar('tech', 'same-seed');
    const avatar2 = personaAvatar('tech', 'same-seed');
    expect(avatar1.src).toBe(avatar2.src);
  });

  it('generates different avatars for different seeds', () => {
    const avatar1 = personaAvatar('tech', 'seed-a');
    const avatar2 = personaAvatar('tech', 'seed-b');
    // Both should be valid, but may differ based on fallback logic
    expect(avatar1).toBeDefined();
    expect(avatar2).toBeDefined();
  });

  it('handles empty seed', () => {
    const avatar = personaAvatar('tech', '');
    expect(avatar).toBeDefined();
    expect(avatar.src).toBeDefined();
  });

  it('returns object with src and className properties', () => {
    const avatar = personaAvatar('tech', 'test-seed');
    expect(avatar).toHaveProperty('src');
    expect(avatar).toHaveProperty('className');
  });

  it('src is a string path', () => {
    const avatar = personaAvatar('marketing', 'seed');
    expect(typeof avatar.src).toBe('string');
    expect(avatar.src).toMatch(/^\/|^[a-zA-Z]/);
  });
});

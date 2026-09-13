import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadSession,
  saveSession,
  clearSession,
  incrementSessionCount,
  getSessionCount,
} from '../storage';
import type { PersistedSession } from '../types';

// Mock sessionStorage and localStorage
const mockStorage: Record<string, string> = {};

const mockSessionStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  },
};

const mockLocalStorage = { ...mockSessionStorage };

global.sessionStorage = mockSessionStorage as any;
global.localStorage = mockLocalStorage as any;

describe('Session Storage', () => {
  beforeEach(() => {
    mockStorage.clear?.();
  });

  afterEach(() => {
    mockStorage.clear?.();
  });

  describe('saveSession and loadSession', () => {
    it('saves and loads a complete session', () => {
      const session: PersistedSession = {
        sessionId: 'test-123',
        moduleId: 'tech',
        specialtyId: 'web-dev',
        startedAt: new Date().toISOString(),
        completedAt: null,
        turns: [],
        pendingAnswer: null,
        sessionLength: 10,
        experienceLevel: 'mid',
        language: 'en',
      };

      saveSession(session);
      const loaded = loadSession();

      expect(loaded).toEqual(session);
    });

    it('returns null when no session is stored', () => {
      const loaded = loadSession();
      expect(loaded).toBeNull();
    });

    it('handles session with turns and pending answer', () => {
      const session: PersistedSession = {
        sessionId: 'test-456',
        moduleId: 'tech',
        specialtyId: 'mobile',
        startedAt: new Date().toISOString(),
        completedAt: null,
        turns: [
          {
            id: 'turn-1',
            question: {
              id: 'q1',
              type: 'open',
              prompt: 'Test question',
              expectedKeyPoints: ['point1'],
              maxScore: 10,
              requiresPractice: false,
            },
            answer: 'Test answer',
            evaluation: {
              score: 8,
              maxScore: 10,
              summary: 'Good',
              strengths: ['strength1'],
              knowledgeGaps: [],
            },
          },
        ],
        pendingAnswer: 'pending text',
        sessionLength: 5,
        experienceLevel: 'senior',
        language: 'vi',
      };

      saveSession(session);
      const loaded = loadSession();

      expect(loaded?.turns).toHaveLength(1);
      expect(loaded?.turns[0].answer).toBe('Test answer');
      expect(loaded?.pendingAnswer).toBe('pending text');
    });

    it('handles corrupt session data gracefully', () => {
      mockStorage['vibe-check:active-session'] = 'invalid json {]';
      const loaded = loadSession();
      expect(loaded).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('removes session from storage', () => {
      const session: PersistedSession = {
        sessionId: 'test-clear',
        moduleId: 'tech',
        specialtyId: 'web-dev',
        startedAt: new Date().toISOString(),
        completedAt: null,
        turns: [],
        pendingAnswer: null,
        sessionLength: 10,
        experienceLevel: 'mid',
        language: 'en',
      };

      saveSession(session);
      expect(loadSession()).not.toBeNull();

      clearSession();
      expect(loadSession()).toBeNull();
    });
  });

  describe('Session Count Management', () => {
    it('gets initial session count as 0', () => {
      const count = getSessionCount();
      expect(count).toBe(0);
    });

    it('increments session count', () => {
      incrementSessionCount();
      expect(getSessionCount()).toBe(1);

      incrementSessionCount();
      expect(getSessionCount()).toBe(2);
    });

    it('persists count across multiple increments', () => {
      for (let i = 0; i < 3; i++) {
        incrementSessionCount();
      }
      expect(getSessionCount()).toBe(3);
    });

    it('handles non-numeric stored count gracefully', () => {
      mockStorage['interview_count'] = 'not-a-number';
      const count = getSessionCount();
      expect(count).toBe(0);
    });
  });

  describe('Session Idempotency', () => {
    it('saving same session twice is safe', () => {
      const session: PersistedSession = {
        sessionId: 'test-idempotent',
        moduleId: 'tech',
        specialtyId: 'web-dev',
        startedAt: new Date().toISOString(),
        completedAt: null,
        turns: [],
        pendingAnswer: null,
        sessionLength: 10,
        experienceLevel: 'mid',
        language: 'en',
      };

      saveSession(session);
      saveSession(session);

      const loaded = loadSession();
      expect(loaded).toEqual(session);
    });
  });
});

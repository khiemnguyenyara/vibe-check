import { describe, it, expect } from 'vitest';
import type { TranscriptTurn } from '../types';

// Test the hearts logic (from chat-pane.tsx countHearts function)
const MAX_HEARTS = 3;
const HEART_LOSS_THRESHOLD = 0.5;

function countHearts(turns: readonly TranscriptTurn[]): number {
  const misses = turns.reduce((count, turn) => {
    if (!turn.evaluation) return count;
    const { score, maxScore } = turn.evaluation;
    const ratio = maxScore === 0 ? 0 : score / maxScore;
    return ratio < HEART_LOSS_THRESHOLD ? count + 1 : count;
  }, 0);
  return Math.max(0, MAX_HEARTS - misses);
}

describe('Hearts Progress System', () => {
  it('starts with max hearts', () => {
    const turns: TranscriptTurn[] = [];
    expect(countHearts(turns)).toBe(MAX_HEARTS);
  });

  it('loses heart for weak answer (below threshold)', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Question',
          expectedKeyPoints: ['point'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'weak answer',
        evaluation: {
          score: 4,
          maxScore: 10,
          summary: 'Weak',
          strengths: [],
          knowledgeGaps: ['point'],
        },
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS - 1);
  });

  it('does not lose heart for strong answer (at threshold)', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Question',
          expectedKeyPoints: ['point'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'good answer',
        evaluation: {
          score: 5,
          maxScore: 10,
          summary: 'OK',
          strengths: ['point'],
          knowledgeGaps: [],
        },
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS);
  });

  it('does not lose heart for strong answer (above threshold)', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Question',
          expectedKeyPoints: ['point'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'excellent answer',
        evaluation: {
          score: 8,
          maxScore: 10,
          summary: 'Great',
          strengths: ['point'],
          knowledgeGaps: [],
        },
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS);
  });

  it('loses multiple hearts for multiple weak answers', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Q1',
          expectedKeyPoints: ['p1'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'weak',
        evaluation: {
          score: 3,
          maxScore: 10,
          summary: 'Weak',
          strengths: [],
          knowledgeGaps: ['p1'],
        },
      },
      {
        id: '2',
        question: {
          id: 'q2',
          type: 'open',
          prompt: 'Q2',
          expectedKeyPoints: ['p2'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'weak',
        evaluation: {
          score: 2,
          maxScore: 10,
          summary: 'Weak',
          strengths: [],
          knowledgeGaps: ['p2'],
        },
      },
      {
        id: '3',
        question: {
          id: 'q3',
          type: 'open',
          prompt: 'Q3',
          expectedKeyPoints: ['p3'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'weak',
        evaluation: {
          score: 1,
          maxScore: 10,
          summary: 'Weak',
          strengths: [],
          knowledgeGaps: ['p3'],
        },
      },
    ];
    expect(countHearts(turns)).toBe(0);
  });

  it('never goes below 0 hearts', () => {
    const turns: TranscriptTurn[] = [
      ...Array(10)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          question: {
            id: `q${i}`,
            type: 'open' as const,
            prompt: 'Q',
            expectedKeyPoints: ['p'],
            maxScore: 10,
            requiresPractice: false,
          },
          answer: 'weak',
          evaluation: {
            score: 1,
            maxScore: 10,
            summary: 'Weak',
            strengths: [],
            knowledgeGaps: ['p'],
          },
        })),
    ];
    expect(countHearts(turns)).toBe(0);
  });

  it('ignores unevaluated turns', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Q1',
          expectedKeyPoints: ['p1'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: null,
        evaluation: null,
      },
      {
        id: '2',
        question: {
          id: 'q2',
          type: 'open',
          prompt: 'Q2',
          expectedKeyPoints: ['p2'],
          maxScore: 10,
          requiresPractice: false,
        },
        answer: 'answer',
        evaluation: null,
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS);
  });

  it('handles zero maxScore gracefully', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'open',
          prompt: 'Q1',
          expectedKeyPoints: [],
          maxScore: 0,
          requiresPractice: false,
        },
        answer: 'answer',
        evaluation: {
          score: 0,
          maxScore: 0,
          summary: 'No points possible',
          strengths: [],
          knowledgeGaps: [],
        },
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS);
  });

  it('heart loss tracks weak answers across multiple choice', () => {
    const turns: TranscriptTurn[] = [
      {
        id: '1',
        question: {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'Pick one',
          options: ['a', 'b', 'c'],
          maxScore: 10,
        },
        answer: 'a',
        evaluation: {
          score: 0,
          maxScore: 10,
          summary: 'Wrong',
          strengths: [],
          knowledgeGaps: ['correct answer'],
        },
      },
    ];
    expect(countHearts(turns)).toBe(MAX_HEARTS - 1);
  });
});

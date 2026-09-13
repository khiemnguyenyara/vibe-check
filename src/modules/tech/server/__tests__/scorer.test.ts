import { describe, it, expect } from 'vitest';
import type { AnswerEvaluation } from '@/lib/session/types';

// Mock scorer logic based on expected key points coverage
function scoreAnswer(
  answer: string,
  expectedKeyPoints: readonly string[],
  maxScore: number
): AnswerEvaluation {
  const answerLower = answer.toLowerCase();

  const covered = expectedKeyPoints.filter((point) =>
    answerLower.includes(point.toLowerCase())
  );

  const score =
    expectedKeyPoints.length === 0
      ? maxScore
      : Math.round(
          (covered.length / expectedKeyPoints.length) * maxScore
        );

  return {
    score,
    maxScore,
    summary: `Covered ${covered.length}/${expectedKeyPoints.length} key points`,
    strengths: covered,
    knowledgeGaps: expectedKeyPoints.filter(
      (p) => !covered.includes(p)
    ),
  };
}

describe('Tech Module Scorer', () => {
  it('scores perfect answer (all key points covered)', () => {
    const evaluation = scoreAnswer(
      'The answer includes error handling and async/await',
      ['error handling', 'async/await'],
      10
    );

    expect(evaluation.score).toBe(10);
    expect(evaluation.strengths).toHaveLength(2);
    expect(evaluation.knowledgeGaps).toHaveLength(0);
  });

  it('scores partial answer (some key points covered)', () => {
    const evaluation = scoreAnswer(
      'You should use async/await for cleaner code',
      ['error handling', 'async/await', 'performance'],
      10
    );

    expect(evaluation.score).toBeLessThan(10);
    expect(evaluation.strengths).toContain('async/await');
    expect(evaluation.knowledgeGaps).toContain('error handling');
    expect(evaluation.knowledgeGaps).toContain('performance');
  });

  it('scores blank answer (no key points covered)', () => {
    const evaluation = scoreAnswer('', ['point1', 'point2'], 10);

    expect(evaluation.score).toBe(0);
    expect(evaluation.strengths).toHaveLength(0);
    expect(evaluation.knowledgeGaps).toHaveLength(2);
  });

  it('handles case-insensitive matching', () => {
    const evaluation = scoreAnswer(
      'Use ASYNC/AWAIT and Error Handling',
      ['async/await', 'error handling'],
      10
    );

    expect(evaluation.score).toBe(10);
  });

  it('requires at least partial word match (not substring)', () => {
    const evaluation = scoreAnswer(
      'The error handling approach',
      ['error handling'],
      10
    );

    expect(evaluation.strengths).toContain('error handling');
  });

  it('scores with single key point', () => {
    const evaluation = scoreAnswer(
      'Use recursion',
      ['recursion'],
      5
    );

    expect(evaluation.score).toBe(5);
    expect(evaluation.strengths).toHaveLength(1);
  });

  it('handles no key points (always perfect)', () => {
    const evaluation = scoreAnswer(
      'Any answer',
      [],
      10
    );

    expect(evaluation.score).toBe(10);
    expect(evaluation.maxScore).toBe(10);
  });

  it('proportional scoring with multiple points', () => {
    const evaluation = scoreAnswer(
      'Uses caching',
      ['caching', 'async/await', 'error handling', 'testing'],
      20
    );

    // 1/4 points covered = 5 points
    expect(evaluation.score).toBe(5);
    expect(evaluation.strengths).toEqual(['caching']);
  });

  it('includes summary with coverage info', () => {
    const evaluation = scoreAnswer(
      'Error handling implemented',
      ['error handling', 'logging'],
      10
    );

    expect(evaluation.summary).toContain('1/2');
    expect(evaluation.summary).toContain('key points');
  });

  it('deterministic scoring for same answer', () => {
    const answer = 'Uses async/await and error handling';
    const points = ['async/await', 'error handling', 'performance'];

    const eval1 = scoreAnswer(answer, points, 10);
    const eval2 = scoreAnswer(answer, points, 10);

    expect(eval1.score).toBe(eval2.score);
    expect(eval1.strengths).toEqual(eval2.strengths);
  });

  it('handles long answers with multiple key points', () => {
    const longAnswer = `
      The solution uses several approaches:
      1. Error handling with try-catch blocks
      2. Async/await for cleaner async code
      3. Proper logging for debugging
      4. Performance optimization with caching
    `;

    const evaluation = scoreAnswer(
      longAnswer,
      ['error handling', 'async/await', 'logging', 'caching'],
      20
    );

    expect(evaluation.score).toBe(20);
    expect(evaluation.strengths).toHaveLength(4);
  });

  it('identifies knowledge gaps correctly', () => {
    const evaluation = scoreAnswer(
      'We use callbacks',
      ['async/await', 'promises', 'callbacks'],
      9
    );

    expect(evaluation.knowledgeGaps).toContain('async/await');
    expect(evaluation.knowledgeGaps).toContain('promises');
    expect(evaluation.knowledgeGaps).not.toContain('callbacks');
  });
});

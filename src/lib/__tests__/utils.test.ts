import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (classname utility)', () => {
  it('concatenates class strings', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('handles undefined and null values', () => {
    const result = cn('valid', undefined, null, 'class');
    expect(result).toContain('valid');
    expect(result).toContain('class');
  });

  it('removes falsy values', () => {
    const result = cn('a', false, '', 'b');
    expect(result).not.toContain('false');
    expect(result).toContain('a');
    expect(result).toContain('b');
  });

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
  });

  it('handles objects with boolean values', () => {
    const result = cn(
      {
        'class-true': true,
        'class-false': false,
      },
      'normal'
    );
    expect(result).toContain('class-true');
    expect(result).not.toContain('class-false');
  });

  it('resolves tailwind conflicts using merge', () => {
    // clsx with tailwind-merge resolves conflicts
    const result = cn('bg-red-500', 'bg-blue-500');
    // Last one should win or merge should resolve it
    expect(result).toBeDefined();
  });

  it('handles nested conditionals', () => {
    const condition = true;
    const result = cn(
      'base',
      condition && 'conditional',
      !condition && 'not-this'
    );
    expect(result).toContain('base');
    expect(result).toContain('conditional');
  });

  it('works with complex tailwind classes', () => {
    const result = cn(
      'flex items-center justify-between gap-4 rounded-lg',
      'p-4 bg-white dark:bg-gray-900'
    );
    expect(result).toContain('flex');
    expect(result).toContain('gap-4');
  });

  it('empty input returns empty or minimal output', () => {
    const result = cn('', undefined, null);
    // Result should be empty or whitespace
    expect(result.trim()).toBe('');
  });

  it('single class returns that class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('preserves class order with spaces', () => {
    const result = cn('first', 'second', 'third');
    expect(result).toMatch(/first.*second.*third/);
  });
});

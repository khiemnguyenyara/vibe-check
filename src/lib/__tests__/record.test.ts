import { describe, it, expect } from 'vitest';
import { getOwn } from '../record';

describe('getOwn', () => {
  it('returns value for existing key', () => {
    const record = { foo: 'bar', num: 42 };
    expect(getOwn(record, 'foo')).toBe('bar');
    expect(getOwn(record, 'num')).toBe(42);
  });

  it('returns undefined for missing key', () => {
    const record = { foo: 'bar' };
    expect(getOwn(record, 'baz')).toBeUndefined();
  });

  it('handles empty record', () => {
    const record = {};
    expect(getOwn(record, 'anything')).toBeUndefined();
  });

  it('does not access prototype properties', () => {
    const record = Object.create({ inherited: 'value' });
    record.own = 'value';

    expect(getOwn(record, 'own')).toBe('value');
    expect(getOwn(record, 'inherited')).toBeUndefined();
  });

  it('does not access constructor property', () => {
    const record = { foo: 'bar' };
    expect(getOwn(record, 'constructor')).toBeUndefined();
  });

  it('does not access __proto__ property', () => {
    const record = { foo: 'bar' };
    expect(getOwn(record, '__proto__')).toBeUndefined();
  });

  it('works with null prototype', () => {
    const record = Object.create(null);
    record.foo = 'bar';
    expect(getOwn(record, 'foo')).toBe('bar');
  });

  it('handles Partial<Record> types', () => {
    const record: Partial<Record<'a' | 'b' | 'c', string>> = { a: 'value' };
    expect(getOwn(record, 'a')).toBe('value');
    expect(getOwn(record, 'b')).toBeUndefined();
  });

  it('returns correct type when value is falsy', () => {
    const record = { zero: 0, empty: '', false: false, null: null };
    expect(getOwn(record, 'zero')).toBe(0);
    expect(getOwn(record, 'empty')).toBe('');
    expect(getOwn(record, 'false')).toBe(false);
    expect(getOwn(record, 'null')).toBe(null);
  });
});

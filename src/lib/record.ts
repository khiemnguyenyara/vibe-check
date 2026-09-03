/**
 * A safe lookup into a record keyed by an untrusted or partial string.
 *
 * `Object.hasOwn` first, not a bare `record[key]` or `key in record`: `key`
 * commonly originates from a request body or another external source, and a
 * plain index read risks resolving a prototype key (`"constructor"`,
 * `"__proto__"`) that was never one of the record's own entries.
 *
 * Returns the value or `undefined` rather than `null` — pair it with `??` at
 * the call site to name the actual fallback (`getOwn(bank, id) ?? general`),
 * rather than a separate boolean guard followed by an index read that
 * repeats the same check.
 *
 * Takes `Partial<Record<...>>` so callers whose map doesn't cover every key
 * of `K` (the common case: a lookup table for only *some* known ids) don't
 * have to fight the type system to use it.
 */
export function getOwn<K extends string, V>(
  record: Partial<Record<K, V>>,
  key: string
): V | undefined {
  return Object.hasOwn(record, key) ? record[key as K] : undefined;
}

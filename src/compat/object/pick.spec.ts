import { describe, expect, it } from 'vitest';
import { pick } from './pick';
import { toArgs } from '../_internal/toArgs';

describe('compat/pick', () => {
  const object = { a: 1, b: 2, c: 3, d: 4 };
  const nested = { a: 1, b: { c: 2, d: 3 } };

  it('should flatten `paths`', () => {
    pick(object, 'a', 'b');
    expect(pick(object, 'a', 'c')).toEqual({ a: 1, c: 3 });
    expect(pick(object, ['a', 'd'], 'c')).toEqual({ a: 1, c: 3, d: 4 });
  });

  it('should support deep paths', () => {
    expect(pick(nested, 'b.c')).toEqual({ b: { c: 2 } });
  });

  it('should support path arrays', () => {
    const object = { 'a.b': 1, a: { b: 2 } };
    const actual = pick(object, [['a.b']]);

    expect(actual).toEqual({ 'a.b': 1 });
  });

  it('should pick a key over a path', () => {
    const object = { 'a.b': 1, a: { b: 2 } };

    ['a.b', ['a.b']].forEach(path => {
      expect(pick(object, path)).toEqual({ 'a.b': 1 });
    });

    const obj = { a: { b: { c: 1 } }, d: { e: 2 }, f: 3, 'f.g': 4 };
    expect(pick(obj, ['a.b.c', 'f.g'])).toEqual({
      a: { b: { c: 1 } },
      'f.g': 4,
    });
  });

  it('should coerce `paths` to strings', () => {
    expect(pick({ 0: 'a', 1: 'b' }, 0)).toEqual({ 0: 'a' });
  });

  it('should return an empty object when `object` is nullish', () => {
    [null, undefined].forEach(value => {
      expect(pick(value, 'valueOf')).toEqual({});
    });
  });

  it('should work with a primitive `object`', () => {
    expect(pick('', 'slice')).toEqual({ slice: ''.slice });
  });

  it('should work with `arguments` object `paths`', () => {
    const args = toArgs(['a', 'c']);
    // eslint-disable-next-line
    // @ts-ignore
    expect(pick(object, args)).toEqual({ a: 1, c: 3 });
  });

  it('should work with stringified path with array', () => {
    const array: number[] = [];
    array[2] = 3;
    expect(pick({ array: [1, 2, 3] }, 'array[2]')).toEqual({ array });

    const array2: number[] = [];
    array2[1] = 2;
    expect(pick({ array: [1, 2, 3] }, 'array[1]')).toEqual({ array: array2 });
  });

  it('should not pick from nonexistent keys', () => {
    const obj: { a?: unknown; b?: unknown } = {};
    const result = pick(obj, ['a', 'b']);

    expect(Reflect.ownKeys(result)).toEqual([]);
  });
});

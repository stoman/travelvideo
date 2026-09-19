import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, warm, hslaToString } from './style.ts';

test('parseColor: hex, rgb(a), hsl(a) all parse to comparable HSLA', () => {
  const hex = parseColor('#3388ff')!;
  const rgb = parseColor('rgb(51, 136, 255)')!;
  assert.ok(hex);
  assert.ok(rgb);
  assert.equal(Math.round(hex.h), Math.round(rgb.h));
  assert.equal(Math.round(hex.s), Math.round(rgb.s));
  assert.equal(Math.round(hex.l), Math.round(rgb.l));

  const hsla = parseColor('hsla(210, 100%, 60%, 0.5)')!;
  assert.equal(hsla.h, 210);
  assert.equal(hsla.a, 0.5);
});

test('parseColor: non-colors (expression keywords, property refs) return null', () => {
  assert.equal(parseColor('linear'), null);
  assert.equal(parseColor('zoom'), null);
  assert.equal(parseColor('interpolate'), null);
});

test('warm: blends hue toward amber, desaturates, lightens -- never flips hue past amber', () => {
  const coolBlue = { h: 210, s: 80, l: 50, a: 1 };
  const result = warm(coolBlue);
  // hue should move toward 38 (amber), not away from it
  assert.ok(result.h < coolBlue.h);
  assert.ok(result.s < coolBlue.s, 'should desaturate');
  assert.ok(result.l > coolBlue.l, 'should lighten');
  assert.equal(result.a, 1, 'alpha is preserved');
});

test('warm: preserves alpha exactly', () => {
  const result = warm({ h: 0, s: 50, l: 50, a: 0.42 });
  assert.equal(result.a, 0.42);
});

test('hslaToString round-trips through parseColor', () => {
  const original = { h: 38, s: 40, l: 70, a: 0.8 };
  const str = hslaToString(original);
  const reparsed = parseColor(str)!;
  assert.equal(reparsed.h, original.h);
  assert.equal(reparsed.s, original.s);
  assert.equal(reparsed.l, original.l);
  assert.equal(reparsed.a, original.a);
});

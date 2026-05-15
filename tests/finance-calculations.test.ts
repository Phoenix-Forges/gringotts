import { describe, expect, it } from 'vitest';
import { cagr, xirr } from '../src/shared/finance/calculations.js';

describe('financial calculations', () => {
  it('calculates CAGR', () => {
    expect(cagr(100, 121, 2)).toBeCloseTo(0.1, 5);
  });

  it('calculates XIRR for a simple investment', () => {
    const result = xirr([
      { amount: -1000, date: new Date('2024-01-01') },
      { amount: 1100, date: new Date('2025-01-01') }
    ]);
    expect(result).toBeGreaterThan(0.09);
    expect(result).toBeLessThan(0.11);
  });
});


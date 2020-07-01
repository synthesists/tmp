import { sum, multiply } from '../src/calculator';

describe('calculator', () => {
  describe('sum', () => {
    it('should calculate "1 + 1"', () => {
      expect(sum(1, 1)).toBe(2);
    });
  });
  describe('multiply', () => {
    it('should calculate "1 * 1"', () => {
      expect(multiply(1, 1)).toBe(1);
    });
  });
});

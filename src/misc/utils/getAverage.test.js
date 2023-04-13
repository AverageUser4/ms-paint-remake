import { getAverage } from './getAverage';

jest.spyOn(console, 'error');

describe('getAverage', () => {

  it('shows error message and returns 0 when first argument is not an array', () => {
    expect(getAverage(5)).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatch(/first argument/i);
  });

  it('shows error message and return 0 when first argument is an empty array', () => {
    expect(getAverage([])).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatch(/first argument/i);
  });

  it('when array consists of invalid items only, it returns 0 and logs error message for every invalid item', () => {
    expect(getAverage(['5', {}, [], null])).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(4);
    expect(console.error.mock.calls[0][0]).toMatch(/element at index/i);
  }); 

  it('when array contains invalid and valid items, it returns the average of valid items and logs error message for every invalid item', () => {
    expect(getAverage([1, 'a', 3])).toBe(2);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toMatch(/element at index/i);
  });

  it('returns average of valid items', () => {
    expect(getAverage([1, 2])).toBeCloseTo(1.5);
    expect(getAverage([3, 4, 5])).toBe(4);
    expect(getAverage([-5, 3])).toBe(-1);
  });

});
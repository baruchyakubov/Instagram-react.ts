import { utilService } from "./util.service";

test('expected to be 1y', () => {
    expect(utilService.getDateFormat(1644796174000)).toBe('1y');
  });

test('expected to be 1d', () => {
    expect(utilService.getDateFormat(1678665321000)).toBe('1d');
  });




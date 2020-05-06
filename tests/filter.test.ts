import { Mote, filter } from "../mote";

it("works", () => {
  expect(1 + 1).toBe(2);
});
test("filter", () => {
  const m1 = new Mote();
  const isEven = x => x % 2 === 0;
  const m2 = filter(m1, isEven);
  m1.push(2);
  expect(m2.currentValue).toBe(2);
  m1.push(3);
  expect(m2.currentValue).toBe(2);
  m1.push(4);
  expect(m2.currentValue).toBe(4);
});

const add = (a: number, b: number) => a + b;

test('Index add fun', () => {
  const ret = add(1, 2);
  expect(ret).toBe(3);
});
export function splitAscensionValues(input, defaultValue) {
  const test = /[0-4][^0-4][0-4]/;
  let value = defaultValue;

  if (input !== "" && test.test(input)) value = input;

  return value.split(/[^0-4]/).map(val => Number(val));
}

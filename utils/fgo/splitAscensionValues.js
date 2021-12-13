export function splitAscensionValues(input, defaultValue) {
  const test = /[1-4]\/[1-4]/;
  let value = defaultValue;

  if (input !== "" && test.test(input)) value = input;

  return value.split("/").map(val => Number(val));
}

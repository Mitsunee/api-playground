export function splitSkillValues(input, defaultValue) {
  const test = /(?:10|[1-9])\/(?:10|[1-9])/;
  let value = defaultValue;

  if (input !== "" && test.test(input)) value = input;

  return value.split("/").map(val => Number(val));
}

export function splitSkillValues(input, defaultValue, test, delimiter) {
  let value = defaultValue;
  if (input !== "" && (!test || test.test(input))) value = input;
  return value.split(delimiter ?? "/").map(val => Number(val));
}

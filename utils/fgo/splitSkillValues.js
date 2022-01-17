export function splitSkillValues(input, defaultValue) {
  const test = /^(10|[1-9])\D(10|[1-9])\D(10|[1-9])$/;
  let value = defaultValue;

  if (input !== "" && test.test(input)) value = input;

  return value.split(/\D/).map(val => Number(val));
}

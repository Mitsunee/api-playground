export function filterUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function filterUniqueId(value, index, self) {
  return self.findIndex(({ id }) => id === value.id) === index;
}

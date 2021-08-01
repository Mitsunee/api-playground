function filterUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function filterUniqueId(value, index, self) {
  return self.findIndex(({ id }) => id === value.id) === index;
}

module.exports = { filterUnique, filterUniqueId };

function sortByProperty(array, property) {
  return array.slice().sort(function (a, b) {
    var propA = a[property];
    var propB = b[property];
    return propA < propB ? 1 : -1;
  });
}
export default sortByProperty;
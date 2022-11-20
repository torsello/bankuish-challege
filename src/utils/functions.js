module.exports = function sortByPriority(course1, course2) {
  if (course1.priority < course2.priority) {
    return -1;
  }
  if (course1.priority > course2.priority) {
    return 1;
  }
  return 0;
};

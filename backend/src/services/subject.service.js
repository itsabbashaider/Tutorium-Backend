const {
  getSubjects,
  searchSubjects: searchSubjectUtil,
  formatSubjectList,
} = require("../utils/subject.util");


const getAllSubjects = async () => {
  const subjects = await getSubjects();

  return formatSubjectList(subjects);
};


const searchSubjects = async (search) => {
  const subjects = await searchSubjectUtil(search);

  return formatSubjectList(subjects);
};


module.exports = {
  getAllSubjects,
  searchSubjects,
};
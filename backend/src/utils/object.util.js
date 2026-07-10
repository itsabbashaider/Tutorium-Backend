const pickFields = (object, fields) => {
  const picked = {};

  fields.forEach((field) => {
    if (object[field] !== undefined) {
      picked[field] = object[field];
    }
  });

  return picked;
};

const hasFields = (object) => {
  return Object.keys(object).length > 0;
};

module.exports = {
  pickFields,
  hasFields,
};
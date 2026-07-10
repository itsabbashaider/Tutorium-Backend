const getPagination = (page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

const getPaginationMeta = (count, page, limit) => ({
  total: count,
  page,
  limit,
  total_pages: Math.ceil(count / limit),
});

module.exports = {
  getPagination,
  getPaginationMeta,
};
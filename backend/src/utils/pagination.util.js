const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPagination = (
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
) => {
  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

const getPaginationMeta = (
  totalItems,
  page,
  limit
) => ({
  totalItems,
  totalPages: Math.ceil(totalItems / limit),
  currentPage: page,
  pageSize: limit,
  hasPreviousPage: page > 1,
  hasNextPage:
    page < Math.ceil(totalItems / limit),
});

module.exports = {
  getPagination,
  getPaginationMeta,
};
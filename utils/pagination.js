const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit,totalItemsCount) => {
    const { count: totalItems, rows: records } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItemsCount / limit);

    return { totalItemsCount, records, totalPages, currentPage };
};

module.exports = { getPagination, getPagingData };

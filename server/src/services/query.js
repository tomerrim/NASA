const defaultPageNumber = 1;
const defualtPageLimit = 0;

function getPagination(query) {
    const page = Math.abs(query.page) || defaultPageNumber;
    const limit = Math.abs(query.limit) || defualtPageLimit;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    }
}

module.exports = {
    getPagination,
}
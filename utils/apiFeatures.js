class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter () {
        const queryObj = {...this.queryString};

        // exclude fields from query
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        //We use mongoDB operators to use >=, <=, = filters
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryJson = JSON.parse(queryString);
        this.query.find(queryJson);
        return this;
    }

    sort () {
        // Sort by fields, response shows first the fields that use on it
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    limit () {
        // Filter by fields, response shows only fields that we use on it
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    pagination() {
        // Pagination
        // page=2&limit=5, 1-5 page 1, 6-10 page 2, 11-15 page 3, etc
        // query = query.skip(1).limit(5);
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit || 1;

        if (page && typeof page !== 'undefined' && limit && typeof limit !== 'undefined' && skip && typeof skip !== 'undefined') {
            this.query = this.query.skip(skip).limit(limit);
        } else {
        }
        return this;
    }

}

module.exports = APIFeatures;
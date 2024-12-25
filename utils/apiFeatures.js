class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // NOTE: A) FILTERING
    // NOTE: #1 create shallow copy of req.query object
    const queryObj = { ...this.queryString };
    // NOTE:#2 have a list  of params that you want to not be queryed for in the data
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // NOTE:#3 if those fields exist in the req.params object we must delete them
    excludedFields.forEach((field) => delete queryObj[field]);

    // NOTE: #3.1 ADVANCED FILTERING for methods like gt, lt, lte and gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // NOTE: B) SORTING
    // NOTE: test request: /api/v1/tours?sort=price
    // NOTE: test request: /api/v1/tours?sort=-price -> descending order
    if (this.queryString.sort) {
      // NOTE: if two docs have the same price then how will we sort them ? to fix this we add optional second paramter
      const sortBy = this.queryString.sort.split(',').join(' ');

      // NOTE: sort by price, etc
      this.query = this.query.sort(sortBy);
    } else {
      // NOTE: if user does not specify any sort field in the query string, we sort by the createdAt field
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // NOTE: C) FIELD LIMITING: to let the user choose which fields they want
    // NOTE: test request: /api/v1/tours?fields=name,duration ....
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // NOTE: we use the select method
      this.query = this.query.select(fields);
    } else {
      // NOTE: removing the __v=0 field in all the data object if there is no 'fields'
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // NOTE: D) PAGINATION
    // NOTE: use skip and limit function
    // NOTE: skip -> how many results should be skipped,limit -> how many results in one page
    // NOTE: test request: '/api/v1/tours?page=2&limit=10'

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

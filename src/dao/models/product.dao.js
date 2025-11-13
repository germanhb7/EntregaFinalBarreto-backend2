const Product = require('../../models/product.model');

class ProductDAO {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true
      };

      // Ordenamiento
      if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
      }

      // Filtrado 
      const filter = query ? { 
        $or: [
          { category: { $regex: query, $options: 'i' } },
          { status: query === 'available' ? true : query === 'unavailable' ? false : undefined }
        ].filter(condition => {
          const value = Object.values(condition)[0];
          return value !== undefined && value !== null;
        })
      } : {};

      const result = await Product.paginate(filter, options);

      // Enlaces 
      const baseUrl = '/api/products?';
      const queryParams = [];
      
      if (limit && parseInt(limit) !== 10) queryParams.push(`limit=${limit}`);
      if (sort) queryParams.push(`sort=${sort}`);
      if (query) queryParams.push(`query=${query}`);
      
      const queryString = queryParams.length > 0 ? `${queryParams.join('&')}&` : '';

      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? 
          `${baseUrl}${queryString}page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? 
          `${baseUrl}${queryString}page=${result.nextPage}` : null
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ProductDAO();
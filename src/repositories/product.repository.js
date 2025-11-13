// src/repositories/product.repository.js
import BaseRepository from './base.repository.js';
import ProductDAO from '../dao/models/product.dao.js';

class ProductRepository extends BaseRepository {
  constructor() {
    super(new ProductDAO());
  }

  // Ejemplo: lógica adicional para productos sin stock
  async getAvailableProducts() {
    const allProducts = await this.dao.getAll();
    return allProducts.filter(p => p.stock > 0);
  }
}

export default new ProductRepository();

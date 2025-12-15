import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService
  ) { }

  async executeSeed() {
    await this.insertNewProducts();

    return 'Seed Executed';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const promises: Promise<any>[] = [];

    products.forEach(product => {
      const promise = this.productsService.create(product);

      promises.push(promise);
    });

    await Promise.all(promises);

    return true;
  }
}

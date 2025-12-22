import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async executeSeed() {
    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.insertNewProducts(firstUser!);

    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create({ ...user, password: bcrypt.hashSync(user.password, 10) }));
    });

    await this.userRepository.save(users);

    return users.at(0);
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const promises: Promise<any>[] = [];

    products.forEach(product => {
      const promise = this.productsService.create(user, product);

      promises.push(promise);
    });

    await Promise.all(promises);

    return true;
  }
}

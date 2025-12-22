import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: "8907a3e1-325e-4f7d-868c-54341673caa2",
    description: "Product ID",
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "T-Shirt Teslo",
    description: "Product Title",
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0.0,
    description: "Product Price",
    uniqueItems: true,
    default: 0
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    example: "Lorem Ipsum",
    description: "Product description",
    uniqueItems: true,
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: "t_shirt_teslo",
    description: "Product Slug / SEO ",
    uniqueItems: true,
    default: null,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: "Product Stock",
    uniqueItems: true,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number

  @ApiProperty({
    example: "[S, M, L, XL]",
    description: "Product Sizes",
    uniqueItems: true,
    default: []
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: "men",
    description: "Product Gender Target",
    uniqueItems: true,
  })
  @Column({
    type: 'text'
  })
  gender: string;

  @ApiProperty({
    example: [],
    description: "Product Tags",
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty({
    example: "[]",
    description: "Product Images",
    uniqueItems: true,
  })
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true },
  )
  images?: ProductImage[];

  @ApiProperty({
    example: User,
    description: "User product creator",
    uniqueItems: true,
    type: () => User
  })
  @ManyToOne(() => User, user => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    } else {
      this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  formatSlug() {
    if (!this.slug) {
      this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
  }
}

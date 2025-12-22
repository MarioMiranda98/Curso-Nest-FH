import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: "Product title (unique)",
    nullable: false,
    minLength: 1,
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: "Product price - Positive number mandatory",
    nullable: true,
    default: 0,
    type: "number",
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: "Product description",
    nullable: true,
    type: "string",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Product slug for SEO purposes",
    nullable: true,
    type: "string",
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: "Product stock - Positive number mandatory",
    nullable: true,
    default: 0,
    type: "number",
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: "Product sizes",
    nullable: false,
    default: [],
    type: "array",
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: "Product gender target",
    nullable: false,
    default: [],
    type: "array",
  })
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: "Product tags",
    nullable: false,
    default: [],
    type: "array",
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: "Product images",
    nullable: true,
    default: null,
    type: "array",
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]
}

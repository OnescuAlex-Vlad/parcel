import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  phonenumber: string;
}

class PackageDto {
  @IsNumber()
  height: number;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  weight: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  dropoff: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  pickup: AddressDto;

  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];
}
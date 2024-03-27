import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested, Validate, ArrayMinSize, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.replace(/\s/g, '').length === 6;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Zip code must be 6 characters long (excluding spaces)';
  }
}

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
  @Validate(CustomTextConstraint, { message: 'Zip code must be 6 characters long (excluding spaces)' })
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

  getVolume(): number {
    return this.height * this.length * this.width;
  }

  getPrice(): number {
    let price = 1; // Each package costs €1
    const volume = this.getVolume();
    const weight = this.weight;

    if (volume >= 5000) {
      price += Math.floor((volume - 5000) / 5000) * 0.50;
    }

    price += weight * 0.10; // For every kilogram of weight, add €0.10 to the price

    return price;
  }
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty({ message: 'Pickup address is required' })
  pickup: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty({ message: 'Dropoff address is required' })
  dropoff: AddressDto;

  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  @ArrayMinSize(1, { message: 'At least 1 package is required' })
  packages: PackageDto[];

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const pkg of this.packages) {
      totalPrice += pkg.getPrice();
    }
    return totalPrice;
  }
}

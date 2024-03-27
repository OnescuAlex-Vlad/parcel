import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested, MinLength, ArrayMinSize, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';
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
}

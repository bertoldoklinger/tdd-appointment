import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterPatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;
}

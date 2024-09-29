import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PatientService } from 'src/patient/core/service/patient.service';
import { RegisterPatientDto } from '../dto/register-patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerPatientDto: RegisterPatientDto) {
    try {
      const patient = await this.patientService.register(registerPatientDto);

      return patient;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}

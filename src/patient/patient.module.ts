import { Module } from '@nestjs/common';
import { PatientService } from './core/service/patient.service';
import { PatientController } from './http/controller/patient.controller';
import { providePatientRepository } from './persistence/repository/patient.repository.provider';

@Module({
  providers: [PatientService, ...providePatientRepository()],
  controllers: [PatientController],
  exports: [PatientService, ...providePatientRepository()],
})
export class PatientModule {}

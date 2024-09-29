import { Module } from '@nestjs/common';
import { PatientService } from './core/service/patient.service';
import { PatientController } from './http/controller/patient.controller';
import { PatientInMemoryRepository } from './persistence/repository/patient.in-memory.repository';

@Module({
  providers: [PatientService, PatientInMemoryRepository],
  controllers: [PatientController],
  exports: [PatientService, PatientInMemoryRepository],
})
export class PatientModule {}

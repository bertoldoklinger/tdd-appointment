import { Module } from '@nestjs/common';
import { PrismaPersistenceModule } from 'src/shared/module/persistence/prisma/prisma-persistence.module';
import { PatientService } from './core/service/patient.service';
import { PatientController } from './http/controller/patient.controller';
import { providePatientRepository } from './persistence/repository/patient.repository.provider';

@Module({
  imports: [PrismaPersistenceModule],
  providers: [PatientService, ...providePatientRepository()],
  controllers: [PatientController],
  exports: [PatientService, ...providePatientRepository()],
})
export class PatientModule {}

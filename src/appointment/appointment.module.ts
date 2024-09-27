import { Module } from '@nestjs/common';
import { PatientModule } from 'src/patient/patient.module';

import { AppointmentService } from './appointment.service';
import { AppointmentController } from './http/controller/appointment.controller';
import { APPOINTMENT_REPOSITORY_TOKEN } from './repository/appointment.repository';
import { AppointmentInMemoryRepository } from './repository/implementation/in-memory/appointment.in-memory.repository';

@Module({
  imports: [PatientModule],
  providers: [
    AppointmentService,
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: AppointmentInMemoryRepository,
    },
  ],
  exports: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}

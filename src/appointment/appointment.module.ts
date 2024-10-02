import { Module } from '@nestjs/common';
import { PatientModule } from 'src/patient/patient.module';

import { AppointmentService } from './core/service/appointment.service';
import { AppointmentController } from './http/controller/appointment.controller';
import { provideAppointmentRepository } from './persistence/repository/appointment.repository.provider';

@Module({
  imports: [PatientModule],
  providers: [AppointmentService, ...provideAppointmentRepository()],
  exports: [AppointmentService, ...provideAppointmentRepository()],
  controllers: [AppointmentController],
})
export class AppointmentModule {}

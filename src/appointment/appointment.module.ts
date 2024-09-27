import { Module } from '@nestjs/common';
import { PatientModule } from 'src/patient/patient.module';

import { AppointmentService } from './appointment.service';


@Module({
  imports: [PatientModule],
  providers: [AppointmentService],
  exports: [],
})
export class AppointmentModule {}

import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment/appointment.service';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [PatientModule, AppointmentModule],
  controllers: [],
  providers: [AppointmentService],
})
export class AppModule {}

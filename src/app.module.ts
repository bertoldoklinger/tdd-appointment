import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentService } from './appointment/appointment.service';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    PatientModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [AppointmentService],
})
export class AppModule {}

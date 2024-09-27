import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment/appointment.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppointmentService],
})
export class AppModule {}

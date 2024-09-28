import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { Appointment } from 'src/appointment/appointment.model';
import { AppointmentService } from 'src/appointment/appointment.service';
import { ScheduleAppointmentDTO } from '../dto/schedule-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  async scheduleAppointment(
    @Body() scheduleAppointmentDTO: ScheduleAppointmentDTO,
  ): Promise<Appointment> {
    try {
      const appointment = await this.appointmentService.scheduleAppointment({
        ...scheduleAppointmentDTO,
        startDate: new Date(scheduleAppointmentDTO.startDate),
        endDate: new Date(scheduleAppointmentDTO.endDate),
      });
      return appointment;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

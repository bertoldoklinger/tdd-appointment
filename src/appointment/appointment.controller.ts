import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ScheduleAppointmentDTO } from './http/dto/schedule-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('schedule')
  async scheduleAppointment(
    @Body() scheduleAppointmentDTO: ScheduleAppointmentDTO,
  ): Promise<void> {
    try {
      await this.appointmentService.scheduleAppointment({
        ...scheduleAppointmentDTO,
        startDate: new Date(scheduleAppointmentDTO.startDate),
        endDate: new Date(scheduleAppointmentDTO.endDate),
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

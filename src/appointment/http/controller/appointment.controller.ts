import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { InvalidDateException } from 'src/appointment/core/exception/invalid-date.exception';
import { AppointmentModel } from 'src/appointment/core/model/appointment.model';
import { AppointmentService } from 'src/appointment/core/service/appointment.service';
import { PatientNotFoundException } from 'src/patient/core/exception';
import { ScheduleAppointmentDTO } from '../dto/schedule-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('schedule')
  @HttpCode(HttpStatus.CREATED)
  async scheduleAppointment(
    @Body() scheduleAppointmentDTO: ScheduleAppointmentDTO,
  ): Promise<AppointmentModel> {
    try {
      const appointment = await this.appointmentService.scheduleAppointment({
        ...scheduleAppointmentDTO,
        startDate: new Date(scheduleAppointmentDTO.startDate),
        endDate: new Date(scheduleAppointmentDTO.endDate),
      });
      return appointment;
    } catch (error: any) {
      if (error instanceof PatientNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidDateException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('confirm/:appointmentId')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('appointmentId') appointmentId: string) {
    try {
      const confirmedAppointment =
        await this.appointmentService.confirmAppointment(appointmentId);
      return confirmedAppointment;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

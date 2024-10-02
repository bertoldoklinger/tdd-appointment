import { Inject, Injectable } from '@nestjs/common';
import { AppointmentModel } from 'src/appointment/core/model/appointment.model';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  AppointmentRepository,
} from 'src/appointment/persistence/repository/appointment.repository.interface';

import { PatientNotFoundException } from 'src/patient/core/exception';
import { PatientService } from 'src/patient/core/service/patient.service';
import { InvalidDateException } from '../exception/invalid-date.exception';

export type AppointmentInput = {
  startDate: Date;
  endDate: Date;
  patientId: string;
};

@Injectable()
export class AppointmentService {
  constructor(
    private readonly patientService: PatientService,
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  public async scheduleAppointment(
    appointmentInput: AppointmentInput,
  ): Promise<AppointmentModel> {
    if (appointmentInput.endDate <= appointmentInput.startDate) {
      throw new InvalidDateException(
        "appointment's endTime should be after startTime",
      );
    }

    if (
      this.isEndDateAfterAndInTheSameDayOfStartDate(
        appointmentInput.startDate,
        appointmentInput.endDate,
      )
    ) {
      throw new InvalidDateException(
        "appointment's endTime should be in the same day as start time's",
      );
    }

    const patientExists = await this.patientService.doesPatientExists(
      appointmentInput.patientId,
    );

    if (!patientExists) {
      throw new PatientNotFoundException('Patient not found');
    }

    const appointment = AppointmentModel.create({
      startDate: appointmentInput.startDate,
      endDate: appointmentInput.endDate,
      patientId: appointmentInput.patientId,
    });

    await this.appointmentRepository.save(appointment);

    return appointment;
  }

  public async confirmAppointment(appointment: AppointmentModel) {
    if (appointment.confirmed === true)
      throw new Error('appointment already confirmed');

    const confirmedAppointment =
      await this.appointmentRepository.confirm(appointment);

    if (!confirmedAppointment) throw new Error('appointment not found');

    return confirmedAppointment;
  }

  private isEndDateAfterAndInTheSameDayOfStartDate(
    startDate: Date,
    endDate: Date,
  ): boolean {
    const differentDays = startDate.getUTCDate() !== endDate.getUTCDate();
    const differentMonths = startDate.getUTCMonth() !== endDate.getUTCMonth();
    const differentYears =
      startDate.getUTCFullYear() !== endDate.getUTCFullYear();
    return differentDays || differentMonths || differentYears;
  }
}

import { Injectable } from '@nestjs/common';
import { PatientService } from '../patient/patient.service';
import { Appointment } from './appointment.model';

type AppointmentInput = {
  startDate: Date;
  endDate: Date;
  patientId: string;
};

@Injectable()
export class AppointmentService {
  constructor(private readonly patientService: PatientService) {}

  public scheduleAppointment(appointmentInput: AppointmentInput): Appointment {
    if (appointmentInput.endDate <= appointmentInput.startDate) {
      throw new Error("appointment's endTime should be after startTime");
    }

    if (
      this.isEndDateAfterAndInTheSameDayOfStartDate(
        appointmentInput.startDate,
        appointmentInput.endDate,
      )
    ) {
      throw new Error(
        "appointment's endTime should be in the same day as start time's",
      );
    }

    const patientExists = this.patientService.doesPatientExists(
      appointmentInput.patientId,
    );

    if (!patientExists) {
      throw new Error('Patient not found');
    }

    const appointment = {
      ...appointmentInput,
      confirmed: false,
    };
    return appointment;
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

import { Test, TestingModule } from '@nestjs/testing';

import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';

type AppointmentInput = {
  startDate: Date;
  endDate: Date;
  patientId: string;
};

@Injectable()
export class AppointmentService {
  public scheduleAppointment(appointmentInput: AppointmentInput): Appointment {
    if (appointmentInput.endDate <= appointmentInput.startDate) {
      throw new Error("appointment's endTime should be after startTime");
    }
    if (
      appointmentInput.startDate.getUTCDate() !==
      appointmentInput.endDate.getUTCDate()
    ) {
      throw new Error(
        "appointment's endTime should be in the same day as start time's",
      );
    }
    const appointment = {
      ...appointmentInput,
      confirmed: false,
    };
    return appointment;
  }
}

describe('AppointmentService', () => {
  let sut: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();

    sut = module.get<AppointmentService>(AppointmentService);
  });

  it('should schedule an unconfirmed appointment for a user on success', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T11:00:00Z');

    const newAppointment = sut.scheduleAppointment({
      startDate,
      endDate,
      patientId: '1',
    });

    expect(newAppointment).toEqual({
      startDate,
      endDate,
      patientId: '1',
      confirmed: false,
    });
  });
  it('end time should not be before the start time on a appointment', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T09:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).toThrow("appointment's endTime should be after startTime");
  });
  it('end time should be after the start time', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).toThrow("appointment's endTime should be after startTime");
  });

  it('an appointment start and end time should be within the same day', () => {
    const startDate = new Date('2024-09-27T23:00:00Z');
    const endDate = new Date('2024-09-28T00:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
});

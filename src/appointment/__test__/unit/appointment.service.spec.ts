import { Test, TestingModule } from '@nestjs/testing';

import { PatientService } from 'src/patient/core/service/patient.service';

import { ConfigModule } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AppointmentService } from 'src/appointment/core/service/appointment.service';
import { provideAppointmentRepository } from 'src/appointment/persistence/repository/appointment.repository.provider';
import { PatientModule } from 'src/patient/patient.module';
import { PrismaPersistenceModule } from 'src/shared/module/persistence/prisma/prisma-persistence.module';
import { makePatientFactory } from 'test/factory/make-patient';

describe('AppointmentService', () => {
  let sut: AppointmentService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PatientModule,
        PrismaPersistenceModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ DATABASE_DATASOURCE: 'MEMORY' })],
        }),
      ],
      providers: [AppointmentService, ...provideAppointmentRepository()],
    }).compile();

    sut = module.get<AppointmentService>(AppointmentService);
    patientService = module.get<PatientService>(PatientService);
  });

  it('should schedule an unconfirmed appointment for a user on success', async () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T11:00:00Z');
    const { patientId } = await makePatientFactory({ patientService });

    const newAppointment = await sut.scheduleAppointment({
      startDate,
      endDate,
      patientId,
    });

    expect(newAppointment).toEqual({
      appointmentId: expect.any(String),
      startDate,
      endDate,
      patientId,
      confirmed: false,
    });
  });
  it('end time should not be before the start time on a appointment', async () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T09:00:00Z');
    const { patientId } = await makePatientFactory({ patientService });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
      }),
    ).rejects.toThrow("appointment's endTime should be after startTime");
  });
  it('end time should be after the start time', async () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');
    const { patientId } = await makePatientFactory({ patientService });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
      }),
    ).rejects.toThrow("appointment's endTime should be after startTime");
  });
  it('an appointment start and end time should be within the same day', async () => {
    const startDate = new Date('2024-09-27T23:00:00Z');
    const endDate = new Date('2024-09-28T00:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).rejects.toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
  it('should throw an error when end time is in same day and hour of next month', async () => {
    const startDate = new Date('2024-09-27T22:00:00Z');
    const endDate = new Date('2024-10-27T23:00:00Z');
    const { patientId } = await makePatientFactory({ patientService });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
      }),
    ).rejects.toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
  it('should throw an error when end time is in same day and hour of next year', async () => {
    const startDate = new Date('2024-09-27T22:00:00Z');
    const endDate = new Date('2025-09-27T23:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).rejects.toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
  it('should throw an error when the patient does not exist', async () => {
    const startDate = new Date('2024-09-27T09:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).rejects.toThrow('Patient not found');
  });
  it('should confirm a appointment when it is not confirmed', async () => {
    const { patientId } = await makePatientFactory({ patientService });
    const startDate = new Date('2024-09-27T09:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');
    const appointment = await sut.scheduleAppointment({
      startDate,
      endDate,
      patientId,
    });

    const confirmedAppointment = await sut.confirmAppointment(
      appointment.appointmentId,
    );

    expect(confirmedAppointment).toEqual({
      appointmentId: expect.any(String),
      startDate: confirmedAppointment.startDate,
      endDate: confirmedAppointment.endDate,
      patientId,
      confirmed: true,
    });
  });

  it('should not confirm a appointment when it is already confirmed', async () => {
    const { patientId } = await makePatientFactory({ patientService });
    const startDate = new Date('2024-09-27T09:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');
    const appointment = await sut.scheduleAppointment({
      startDate,
      endDate,
      patientId,
    });

    await sut.confirmAppointment(appointment.appointmentId);

    expect(
      async () => await sut.confirmAppointment(appointment.appointmentId),
    ).rejects.toThrow('appointment already confirmed');
  });
  it('should not confirm a unexistent appointment', async () => {
    const appointmentId = randomUUID();

    expect(
      async () => await sut.confirmAppointment(appointmentId),
    ).rejects.toThrow('appointment not found');
  });
});

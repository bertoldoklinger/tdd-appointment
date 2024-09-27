import { Test, TestingModule } from '@nestjs/testing';
import { PatientModule } from '../patient/patient.module';
import { PatientService } from '../patient/patient.service';
import { AppointmentService } from './appointment.service';

describe('AppointmentService', () => {
  let sut: AppointmentService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PatientModule],
      providers: [AppointmentService],
    }).compile();

    sut = module.get<AppointmentService>(AppointmentService);
    patientService = module.get<PatientService>(PatientService);
  });

  it('should schedule an unconfirmed appointment for a user on success', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T11:00:00Z');

    const { id: patientId } = patientService.register({
      name: 'Bertoldo Klinger',
    });

    const newAppointment = sut.scheduleAppointment({
      startDate,
      endDate,
      patientId,
    });

    expect(newAppointment).toEqual({
      startDate,
      endDate,
      patientId,
      confirmed: false,
    });
  });
  it('end time should not be before the start time on a appointment', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T09:00:00Z');

    const { id: patientId } = patientService.register({
      name: 'John Doe',
    });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
      }),
    ).toThrow("appointment's endTime should be after startTime");
  });
  it('end time should be after the start time', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');

    const { id: patientId } = patientService.register({
      name: 'John Doe',
    });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
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
  it('should throw an error when end time is in same day and hour of next month', () => {
    const startDate = new Date('2024-09-27T22:00:00Z');
    const endDate = new Date('2024-10-27T23:00:00Z');

    const { id: patientId } = patientService.register({
      name: 'John Doe',
    });

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId,
      }),
    ).toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
  it('should throw an error when end time is in same day and hour of next year', () => {
    const startDate = new Date('2024-09-27T22:00:00Z');
    const endDate = new Date('2025-09-27T23:00:00Z');

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

  it('should throw an error when the patient does not exist', () => {
    const startDate = new Date('2024-09-27T09:00:00Z');
    const endDate = new Date('2024-09-27T10:00:00Z');

    expect(() =>
      sut.scheduleAppointment({
        startDate,
        endDate,
        patientId: '1',
      }),
    ).toThrow('Patient not found');
  });
});

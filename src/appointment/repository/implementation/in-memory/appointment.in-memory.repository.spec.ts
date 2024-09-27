import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

import { Appointment } from '../../../appointment.model';
import { AppointmentInMemoryRepository } from './appointment.in-memory.repository';

describe('AppointmentInMemoryRepository', () => {
  let sut: AppointmentInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AppointmentInMemoryRepository],
    }).compile();

    sut = module.get<AppointmentInMemoryRepository>(
      AppointmentInMemoryRepository,
    );
  });

  it('should save a appointment', () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T11:00:00Z');
    const patientId = randomUUID();
    const newAppointment = Appointment.create({
      startDate,
      endDate,
      patientId,
    });

    sut.save(newAppointment);

    expect(sut.appointments.length).toBe(1);
    expect(sut.appointments[0]).toEqual({
      appointmentId: expect.any(String),
      startDate: newAppointment.startDate,
      endDate: newAppointment.endDate,
      confirmed: false,
      patientId: expect.any(String),
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { AppointmentModule } from 'src/appointment/appointment.module';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  AppointmentRepository,
} from 'src/appointment/persistence/repository/appointment.repository.interface';
import { PatientModule } from 'src/patient/patient.module';
import {
  PATIENT_REPOSITORY_TOKEN,
  PatientRepository,
} from 'src/patient/persistence/repository/patient.repository.interface';
import { createNestApp } from 'test/test-e2e.setup';

import { AppointmentService } from 'src/appointment/core/service/appointment.service';
import { PatientService } from 'src/patient/core/service/patient.service';
import { PrismaPersistenceModule } from 'src/shared/module/persistence/prisma/prisma-persistence.module';
import { makePatientFactory } from 'test/factory/make-patient';

describe('[INTEGRATION] Appointment', () => {
  let app: INestApplication;
  let module: TestingModule;
  let appointmentRepository: AppointmentRepository;
  let patientRepository: PatientRepository;
  let patientService: PatientService;
  let appointmentService: AppointmentService;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([
      ConfigModule.forRoot({
        isGlobal: true,
        load: [() => ({ DATABASE_DATASOURCE: 'PRISMA' })],
      }),
      PrismaPersistenceModule,
      AppointmentModule,
      PatientModule,
    ]);
    app = nestTestSetup.app;
    module = nestTestSetup.module;

    appointmentRepository = module.get<AppointmentRepository>(
      APPOINTMENT_REPOSITORY_TOKEN,
    );
    appointmentService = module.get<AppointmentService>(AppointmentService);
    patientRepository = module.get<PatientRepository>(PATIENT_REPOSITORY_TOKEN);
    patientService = module.get<PatientService>(PatientService);
  });

  afterEach(async () => {
    await appointmentRepository.clear();
    await patientRepository.clear();
  });

  afterAll(async () => {
    await app.close();
    module.close();
  });

  it('should schedule an unconfirmed appointment for a user on success', async () => {
    const startDate = new Date('2024-09-27T10:00:00Z');
    const endDate = new Date('2024-09-27T11:00:00Z');

    const { patientId } = await makePatientFactory({ patientService });

    const newAppointment = await appointmentService.scheduleAppointment({
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
});

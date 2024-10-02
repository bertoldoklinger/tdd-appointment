import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { AppointmentModule } from 'src/appointment/appointment.module';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  AppointmentRepository,
} from 'src/appointment/persistence/repository/appointment.repository.interface';
import { PatientModel } from 'src/patient/core/model/patient.model';
import { PatientModule } from 'src/patient/patient.module';
import {
  PATIENT_REPOSITORY_TOKEN,
  PatientRepository,
} from 'src/patient/persistence/repository/patient.repository.interface';
import { createNestApp } from 'test/test-e2e.setup';

import { randomUUID } from 'crypto';
import { AppointmentModel } from 'src/appointment/core/model/appointment.model';
import { PrismaPersistenceModule } from 'src/shared/module/persistence/prisma/prisma-persistence.module';
import request from 'supertest';

const PATIENT_ID = 'PATIENT_ID';

describe('[E2E] Appointment', () => {
  let app: INestApplication;
  let module: TestingModule;
  let appointmentRepository: AppointmentRepository;
  let patientRepository: PatientRepository;

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([
      //TODO inject prisma repository as a datasource
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
    patientRepository = module.get<PatientRepository>(PATIENT_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    await appointmentRepository.clear();
    await patientRepository.clear();
  });

  afterAll(async () => {
    await app.close();
    module.close();
  });

  describe('/appointment/schedule', () => {
    it('schedules an unconfirmed appointment', async () => {
      const patient = PatientModel.create({
        patientId: PATIENT_ID,
        name: 'Bertoldo Klinger',
        age: 25,
      });
      await patientRepository.save(patient);
      const res = await request(app.getHttpServer())
        .post('/appointment/schedule')
        .send({
          startDate: new Date('2024-09-27T10:00:00Z'),
          endDate: new Date('2024-09-27T11:00:00Z'),
          patientId: PATIENT_ID,
        });
      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        appointmentId: expect.any(String),
        patientId: PATIENT_ID,
        confirmed: false,
        startDate: expect.any(String),
        endDate: expect.any(String),
      });
    });

    it('throws error if the patient does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post('/appointment/schedule')
        .send({
          startDate: new Date('2024-09-27T10:00:00Z'),
          endDate: new Date('2024-09-27T11:00:00Z'),
          patientId: PATIENT_ID,
        });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body).toEqual({
        message: 'Patient not found',
        error: 'Not Found',
        statusCode: 404,
      });
    });
    const invalidDates = [
      {
        startDate: '2024-09-27T10:00:00Z',
        endDate: '2024-09-26T11:00:00Z',
        message: "appointment's endTime should be after startTime",
      },
      {
        startDate: '2023-09-27T10:00:00Z',
        endDate: '2024-09-27T09:00:00Z',
        message:
          "appointment's endTime should be in the same day as start time's",
      },
    ];
    it.each(invalidDates)(
      'throws error if startDate or endDate is invalid - $message',
      async ({ startDate, endDate, message }) => {
        const res = await request(app.getHttpServer())
          .post('/appointment/schedule')
          .send({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            patientId: PATIENT_ID,
          });

        expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        expect(res.body).toEqual({
          message: message,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    );
  });

  describe('/appointment/confirm', () => {
    it('should confirm a appointment', async () => {
      const patient = PatientModel.create({
        patientId: PATIENT_ID,
        name: 'Bertoldo Klinger',
        age: 25,
      });
      const appointment = AppointmentModel.create({
        startDate: new Date('2024-09-27T10:00:00Z'),
        endDate: new Date('2024-09-27T11:00:00Z'),
        patientId: PATIENT_ID,
      });
      await patientRepository.save(patient);
      await appointmentRepository.save(appointment);

      const res = await request(app.getHttpServer()).patch(
        `/appointment/confirm/${appointment.appointmentId}`,
      );

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        appointmentId: expect.any(String),
        patientId: PATIENT_ID,
        confirmed: true,
        startDate: expect.any(String),
        endDate: expect.any(String),
      });
    });
    it('should not confirm an already confirmed appointment', async () => {
      const patient = PatientModel.create({
        patientId: PATIENT_ID,
        name: 'Bertoldo Klinger',
        age: 25,
      });
      const appointment = AppointmentModel.create({
        startDate: new Date('2024-09-27T10:00:00Z'),
        endDate: new Date('2024-09-27T11:00:00Z'),
        patientId: PATIENT_ID,
      });
      await patientRepository.save(patient);
      await appointmentRepository.save(appointment);
      await appointmentRepository.confirm(appointment);

      const res = await request(app.getHttpServer()).patch(
        `/appointment/confirm/${appointment.appointmentId}`,
      );

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual({
        error: 'Bad Request',
        message: 'appointment already confirmed',
        statusCode: 400,
      });
    });
    it('should not confirm an inexistent appointment', async () => {
      const res = await request(app.getHttpServer()).patch(
        `/appointment/confirm/${randomUUID()}`,
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body).toEqual({
        error: 'Not Found',
        message: 'appointment not found',
        statusCode: 404,
      });
    });
  });
});

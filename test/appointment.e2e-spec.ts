import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from 'src/patient/patient.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppointmentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('[POST] /appointment/schedule', () => {
    it('should schedule a new appointment succesfully', async () => {
      const patient = new PatientService().register({
        name: 'BertoldoKlinger',
      });
      const requestBody = {
        startDate: '2024-09-27T10:00:00Z',
        endDate: '2024-09-27T11:00:00Z',
        patientId: patient.id,
      };

      const response = await request(app.getHttpServer())
        .post('/appointment/schedule')
        .send(requestBody);

      console.log(response.body);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        appointmentId: expect.any(String),
        startDate: requestBody.startDate,
        endDate: requestBody.endDate,
        patientId: patient.id,
        confirmed: false,
      });
    });
  });
});

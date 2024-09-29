import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

import { PatientInMemoryRepository } from 'src/patient/persistence/repository/patient.in-memory.repository';
import { PatientService } from './patient.service';

describe('PatientService', () => {
  let sut: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientInMemoryRepository,
          useClass: PatientInMemoryRepository,
        },
      ],
    }).compile();

    sut = module.get<PatientService>(PatientService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('register', () => {
    it('should return a new patient with given name', () => {
      const newPatient = sut.register({ name: 'Bertoldo Klinger', age: 18 });

      expect(newPatient).toEqual({
        patientId: expect.any(String),
        name: 'Bertoldo Klinger',
        age: 18,
      });
    });
    it('should not register a patient if its age is less than 18 years', () => {
      const invalidPatient = {
        name: 'invalid_patient',
        age: 17,
      };

      expect(() => sut.register(invalidPatient)).toThrow(
        'patient age must be equal or greather than 18 years',
      );
    });
  });
  describe('doesPatientExist', () => {
    it('should return false when no patient was registered', async () => {
      const patientId = randomUUID();

      const patientAlreadyExists = await sut.doesPatientExists(patientId);

      expect(patientAlreadyExists).toBe(false);
    });
    it('should return true when a patient is already registered', async () => {
      const { patientId } = await sut.register({
        name: 'Bertoldo Klinger',
        age: 18,
      });

      const patientAlreadyExists = await sut.doesPatientExists(patientId);

      expect(patientAlreadyExists).toBe(true);
    });

    it('should return different ids when called twice with the same name', () => {
      const firstPatient = sut.register({ name: 'Bertoldo Klinger', age: 18 });
      const secondPatient = sut.register({ name: 'Bertoldo Klinger', age: 18 });
      expect(firstPatient).not.toEqual(secondPatient);
    });
  });
});

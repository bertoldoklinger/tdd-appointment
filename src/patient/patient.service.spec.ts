import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PatientService } from './patient.service';

describe('PatientService', () => {
  let sut: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientService],
    }).compile();

    sut = module.get<PatientService>(PatientService);
  });
  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('register', () => {
    it('should return a new patient with given name', () => {
      const newPatient = sut.register({ name: 'Bertoldo Klinger' });

      expect(newPatient).toEqual({
        id: expect.any(String),
        name: 'Bertoldo Klinger',
      });
    });
  });
  describe('doesPatientExist', () => {
    it('should return false when no patient was registered', () => {
      const patientId = randomUUID();

      const patientAlreadyExists = sut.doesPatientExists(patientId);

      expect(patientAlreadyExists).toBe(false);
    });
    it('should return true when a patient is already registered', () => {
      const { id: patientId } = sut.register({ name: 'Bertoldo Klinger' });

      const patientAlreadyExists = sut.doesPatientExists(patientId);

      expect(patientAlreadyExists).toBe(true);
    });

    it('should return different ids when called twice with the same name', () => {
      const firstPatient = sut.register({ name: 'Bertoldo Klinger' });
      const secondPatient = sut.register({ name: 'Bertoldo Klinger' });
      expect(firstPatient).not.toEqual(secondPatient);
    });
  });
});

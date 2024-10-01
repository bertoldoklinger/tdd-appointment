import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { PatientInMemoryRepository } from 'src/patient/persistence/repository/implementation/patient.in-memory.repository';
import { PATIENT_REPOSITORY_TOKEN } from 'src/patient/persistence/repository/patient.repository.interface';
import { providePatientRepository } from 'src/patient/persistence/repository/patient.repository.provider';
import { PatientService } from './patient.service';

describe('PatientService', () => {
  let sut: PatientService;
  let patientRepository: PatientInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ DATABASE_DATASOURCE: 'MEMORY' })],
        }),
      ],
      providers: [PatientService, ...providePatientRepository()],
    }).compile();
    patientRepository = module.get<PatientInMemoryRepository>(
      PATIENT_REPOSITORY_TOKEN,
    );
    patientRepository.clear();
    sut = module.get<PatientService>(PatientService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  // it('should be defined', () => {
  //   expect(sut).toBeDefined();
  // });

  describe('register', () => {
    it('should return a new patient with given name', async () => {
      const newPatient = await sut.register({
        name: 'Bertoldo Klinger',
        age: 18,
      });

      expect(newPatient).toEqual({
        patientId: expect.any(String),
        name: 'Bertoldo Klinger',
        age: 18,
      });
    });
    // it('should not register a patient if its age is less than 18 years', () => {
    //   const invalidPatient = {
    //     name: 'invalid_patient',
    //     age: 17,
    //   };

    //   expect(() => sut.register(invalidPatient)).toThrow(
    //     'patient age must be equal or greather than 18 years',
    //   );
    // });
  });
  // describe('doesPatientExist', () => {
  //   it('should return false when no patient was registered', async () => {
  //     const patientId = randomUUID();

  //     const patientAlreadyExists = await sut.doesPatientExists(patientId);

  //     expect(patientAlreadyExists).toBe(false);
  //   });
  //   it('should return true when a patient is already registered', async () => {
  //     const { patientId } = await sut.register({
  //       name: 'Bertoldo Klinger',
  //       age: 18,
  //     });

  //     const patientAlreadyExists = await sut.doesPatientExists(patientId);

  //     expect(patientAlreadyExists).toBe(true);
  //   });

  //   it('should return different ids when called twice with the same name', () => {
  //     const firstPatient = sut.register({ name: 'Bertoldo Klinger', age: 18 });
  //     const secondPatient = sut.register({ name: 'Bertoldo Klinger', age: 18 });
  //     expect(firstPatient).not.toEqual(secondPatient);
  //   });
  // });
});

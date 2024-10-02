import { Inject, Injectable } from '@nestjs/common';

import {
  PATIENT_REPOSITORY_TOKEN,
  PatientRepository,
} from 'src/patient/persistence/repository/patient.repository.interface';
import { InvalidAgeError } from '../exception/invalid-age-error';
import { PatientAlreadyExistsError } from '../exception/patient-already-exists-error';
import { PatientInput, PatientModel } from '../model/patient.model';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY_TOKEN)
    private readonly patientRepository: PatientRepository,
  ) {}

  public async register(patientInput: PatientInput): Promise<PatientModel> {
    if (patientInput.age < 18)
      throw new InvalidAgeError(
        'patient age must be equal or greather than 18 years',
      );
    const patient = PatientModel.create(patientInput);
    const patientExists = await this.doesPatientExists(patient.patientId);
    if (patientExists)
      throw new PatientAlreadyExistsError('Patient Already Exists');
    await this.patientRepository.save(patient);
    return patient;
  }

  public async doesPatientExists(patientId: string): Promise<boolean> {
    const patient = await this.patientRepository.getById(patientId);
    return !!patient;
  }
}

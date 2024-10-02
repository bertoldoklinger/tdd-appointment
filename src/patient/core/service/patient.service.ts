import { Inject, Injectable } from '@nestjs/common';

import {
  PATIENT_REPOSITORY_TOKEN,
  PatientRepository,
} from 'src/patient/persistence/repository/patient.repository.interface';
import {
  InvalidAgeException,
  PatientAlreadyExistsException,
} from '../exception';
import { PatientInput, PatientModel } from '../model/patient.model';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY_TOKEN)
    private readonly patientRepository: PatientRepository,
  ) {}

  public async register(patientInput: PatientInput): Promise<PatientModel> {
    const patient = PatientModel.create(patientInput);
    if (!patient) {
      throw new InvalidAgeException(
        'patient age must be equal or greather than 18 years',
      );
    }
    const patientExists = await this.doesPatientExists(patient.patientId);
    if (patientExists)
      throw new PatientAlreadyExistsException('patient already exists');
    await this.patientRepository.save(patient);
    return patient;
  }

  public async doesPatientExists(patientId: string): Promise<boolean> {
    const patient = await this.patientRepository.getById(patientId);
    return !!patient;
  }
}

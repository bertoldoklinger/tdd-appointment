import { Injectable } from '@nestjs/common';

import { PatientInMemoryRepository } from 'src/patient/persistence/repository/patient.in-memory.repository';
import { InvalidAgeError } from '../exception/invalid-age-error';
import { PatientInput, PatientModel } from '../model/patient.model';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientInMemoryRepository) {}

  public async register(patientInput: PatientInput): Promise<PatientModel> {
    if (patientInput.age < 18)
      throw new InvalidAgeError(
        'patient age must be equal or greather than 18 years',
      );
    const patient = PatientModel.create(patientInput);
    const patientExists = this.doesPatientExists(patient.patientId);
    if (patientExists) throw new Error('Patient Already Exists');
    await this.patientRepository.save(patient);
    return patient;
  }

  public async doesPatientExists(patientId: string): Promise<boolean> {
    const patientExists = await this.patientRepository.getById(patientId);
    if (patientExists) return true;
    return false;
  }
}

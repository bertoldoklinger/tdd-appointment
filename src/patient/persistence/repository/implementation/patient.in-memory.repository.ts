import { Injectable } from '@nestjs/common';
import { PatientModel } from 'src/patient/core/model/patient.model';
import { PatientRepository } from '../patient.repository.interface';

@Injectable()
export class PatientInMemoryRepository implements PatientRepository {
  private items: PatientModel[] = [];

  async save(patient: PatientModel): Promise<PatientModel> {
    this.items.push(patient);

    return PatientModel.createFrom(patient);
  }

  async getById(patientId: string): Promise<PatientModel | undefined> {
    const patient = this.items.find(
      (patient) => patient.patientId === patientId,
    );
    if (!patient) return undefined;
    return patient;
  }

  async register() {}

  async clear(): Promise<void> {
    this.items = [];
  }
}

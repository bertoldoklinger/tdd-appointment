import { Injectable } from '@nestjs/common';
import { PatientModel } from 'src/patient/core/model/patient.model';

@Injectable()
export class PatientInMemoryRepository {
  private items: PatientModel[] = [];

  async save(patient: PatientModel): Promise<PatientModel> {
    this.items.push(patient);

    return PatientModel.createFrom(patient);
  }

  async getById(patientId: string): Promise<PatientModel | null> {
    const patient = this.items.find(
      (patient) => patient.patientId === patientId,
    );
    if (!patient) return null;
    return patient;
  }
}

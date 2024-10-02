import { PatientModel } from 'src/patient/core/model/patient.model';

export interface PatientRepository {
  save(patient: PatientModel): Promise<PatientModel>;
  getById(patientId: string): Promise<PatientModel | undefined>;
  clear(): Promise<void>;
}

export const PATIENT_REPOSITORY_TOKEN = 'patient-repository-token';

import { PatientModel } from 'src/patient/core/model/patient.model';

export interface PatientRepository {
  register(patient: PatientModel): Promise<PatientModel>;
  save(patient: PatientModel): Promise<PatientModel>;
  getById(patientId: string): Promise<PatientModel | undefined>;
}

export const PATIENT_REPOSITORY_TOKEN = 'patient-repository-token';

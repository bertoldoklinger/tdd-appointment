import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type PatientInput = {
  name: string;
};

interface Patient {
  id: string;
  name: string;
}

@Injectable()
export class PatientService {
  private readonly patients: Patient[] = [];

  public register(patientInput: PatientInput): Patient {
    const newPatient = {
      id: randomUUID(),
      name: patientInput.name,
    };

    this.patients.push(newPatient);

    return newPatient;
  }

  public doesPatientExists(patientId: string): boolean {
    return this.patients.some((patient) => patient.id === patientId);
  }
}

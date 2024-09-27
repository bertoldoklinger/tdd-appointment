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
  public register(patientInput: PatientInput): Patient {
    return {
      id: randomUUID(),
      name: patientInput.name,
    };
  }
}

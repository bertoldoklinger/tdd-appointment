import { randomUUID } from 'crypto';
import { WithOptional } from 'src/shared/core/type/with-optional.type';

export type PatientInput = {
  name: string;
  age: number;
};

export class PatientModel {
  patientId: string;
  name: string;
  age: number;

  private constructor(data: PatientModel) {
    Object.assign(this, data);
  }

  static create(data: WithOptional<PatientModel, 'patientId'>) {
    const patient = new PatientModel({
      ...data,
      patientId: data.patientId ?? randomUUID(),
    });

    return patient;
  }

  static createFrom(data: PatientModel): PatientModel {
    return new PatientModel(data);
  }
}

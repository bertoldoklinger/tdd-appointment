import { randomUUID } from 'crypto';
import { WithOptional } from 'src/shared/core/type/with-optional.type';
import { InvalidAgeException } from '../exception';

export type PatientInput = {
  name: string;
  age: number;
};

export class PatientModel {
  patientId: string;
  name: string;
  age: number;

  private constructor(data: PatientModel) {
    if (data.age < 18)
      throw new InvalidAgeException(
        'patient age must be equal or greather than 18 years',
      );
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

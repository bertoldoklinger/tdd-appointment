import { PatientModel } from 'src/patient/core/model/patient.model';

describe('PatientModel', () => {
  const DEFAULT_NAME = 'Bertoldo Klinger';
  const AVERAGE_AGE = 25;
  const INVALID_AGE = 17;

  it('should create a PatientModel', async () => {
    const patient = PatientModel.create({
      name: DEFAULT_NAME,
      age: AVERAGE_AGE,
    });

    expect(patient).toEqual({
      patientId: expect.any(String),
      name: DEFAULT_NAME,
      age: AVERAGE_AGE,
    });
  });
  it('should not create a PatientModel with invalid age', async () => {
    expect(() =>
      PatientModel.create({
        name: DEFAULT_NAME,
        age: INVALID_AGE,
      }),
    ).toThrow('patient age must be equal or greather than 18 years');
  });
});

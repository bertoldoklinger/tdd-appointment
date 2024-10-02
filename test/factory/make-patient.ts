import { PatientModel } from 'src/patient/core/model/patient.model';
import { PatientService } from 'src/patient/core/service/patient.service';

type MakePatientFactoryParams = {
  patientService: PatientService;
  name?: string;
  age?: number;
};

const AVERAGE_AGE = 25;
const DEFAULT_NAME = 'John Doe';

export const makePatientFactory = async (
  params: MakePatientFactoryParams,
): Promise<PatientModel> => {
  const patient = await params.patientService.register({
    name: params.name ?? DEFAULT_NAME,
    age: params.age ?? AVERAGE_AGE,
  });

  return patient;
};

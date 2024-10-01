import { PatientModel } from 'src/patient/core/model/patient.model';
import { Repository } from 'typeorm';
import { Patient } from '../../typeorm/entity/patient.entity';
import { PatientRepository } from '../patient.repository.interface';

export class PatientTypeOrmRepository implements PatientRepository {
  constructor(private patientRepository: Repository<Patient>) {}

  async register(patient: PatientModel): Promise<PatientModel> {
    await this.patientRepository.insert(patient);
    return patient;
  }
  async save(patient: PatientModel): Promise<PatientModel> {
    const patientSaved = await this.patientRepository.save(patient);
    return PatientModel.createFrom(patientSaved);
  }
  async getById(patientId: string): Promise<PatientModel | undefined> {
    const patient = await this.patientRepository.findOne({
      where: {
        id: patientId,
      },
    });
    return PatientModel.createFrom({
      ...patient,
      patientId: patient.id,
    });
  }

  async create(patient: Patient) {
    await this.patientRepository.insert(patient);
    return patient;
  }

  async findAll() {
    return this.patientRepository.find();
  }
}

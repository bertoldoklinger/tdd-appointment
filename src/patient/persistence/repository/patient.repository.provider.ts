import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from '../typeorm/entity/patient.entity';

import { PatientInMemoryRepository } from './implementation/patient.in-memory.repository';
import { PATIENT_REPOSITORY_TOKEN } from './patient.repository.interface';

enum DataSource {
  TYPEORM = 'TYPEORM',
  MEMORY = 'MEMORY',
}

export function providePatientRepository(): Provider[] {
  return [
    {
      provide: PATIENT_REPOSITORY_TOKEN,
      useFactory: (configService: ConfigService) => {
        const dataSource = configService.get<string>('DATABASE_DATASOURCE');
        switch (dataSource) {
          case DataSource.TYPEORM:
            return null;
          case DataSource.MEMORY:
          default:
            return new PatientInMemoryRepository();
        }
      },
      inject: [ConfigService],
    },
  ];
}
export async function providePatientRepositoryFactory(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependenciesProvider: PatientRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.TYPEORM:
      return null;
    case DataSource.MEMORY:
    default:
      return new PatientInMemoryRepository();
  }
}

@Injectable()
export class PatientRepoDependenciesProvider {
  constructor(
    @InjectRepository(Patient)
    public typeOrmRepository: Repository<Patient>,
  ) {}
}

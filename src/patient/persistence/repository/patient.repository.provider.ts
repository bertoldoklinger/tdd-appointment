import { Inject, Injectable, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataSource } from 'src/shared/database/enum/data-source.enum';
import { PatientInMemoryRepository } from './implementation/patient.in-memory.repository';
import { PATIENT_REPOSITORY_TOKEN } from './patient.repository.interface';

export function providePatientRepository(): Provider[] {
  return [
    {
      provide: PATIENT_REPOSITORY_TOKEN,
      useFactory: (configService: ConfigService) => {
        const dataSource = configService.get<string>('DATABASE_DATASOURCE');
        switch (dataSource) {
          case DataSource.PRISMA:
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
export async function providePatientRepositoryFactory() {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return null;
    case DataSource.MEMORY:
    default:
      return new PatientInMemoryRepository();
  }
}

@Injectable()
export class PatientRepoDependenciesProvider {
  constructor(
    @Inject(PATIENT_REPOSITORY_TOKEN)
    public prismaPatientRepository: any,
  ) {}
}

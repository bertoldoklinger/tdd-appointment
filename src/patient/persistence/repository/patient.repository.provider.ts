import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataSource } from 'src/shared/database/enum/data-source.enum';
import { PrismaService } from 'src/shared/module/persistence/prisma/prisma.service';
import { PatientInMemoryRepository } from './implementation/patient.in-memory.repository';
import { PatientPrismaRepository } from './implementation/patient.prisma.repository';
import { PATIENT_REPOSITORY_TOKEN } from './patient.repository.interface';

export function providePatientRepository(): Provider[] {
  return [
    {
      provide: PATIENT_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: PatientRepoDependenciesProvider,
      ) => providePatientRepositoryFactory(dependenciesProvider),
      inject: [PatientRepoDependenciesProvider],
    },
    PatientRepoDependenciesProvider,
  ];
}
export async function providePatientRepositoryFactory(
  dependenciesProvider: PatientRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new PatientPrismaRepository(dependenciesProvider.prismaService);
    case DataSource.MEMORY:
    default:
      return new PatientInMemoryRepository();
  }
}

@Injectable()
export class PatientRepoDependenciesProvider {
  constructor(public prismaService: PrismaService) {}
}

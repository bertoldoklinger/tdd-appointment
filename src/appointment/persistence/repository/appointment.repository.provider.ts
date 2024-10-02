import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataSource } from 'src/shared/database/enum/data-source.enum';
import { PrismaService } from 'src/shared/module/persistence/prisma/prisma.service';
import { APPOINTMENT_REPOSITORY_TOKEN } from './appointment.repository.interface';
import { AppointmentInMemoryRepository } from './implementation/in-memory/appointment.in-memory.repository';
import { AppointmentPrismaRepository } from './implementation/prisma/appointment.prisma.repository';

export function provideAppointmentRepository(): Provider[] {
  return [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: AppointmentRepoDependenciesProvider,
      ) => provideAppointmentRepositoryFactory(dependenciesProvider),
      inject: [AppointmentRepoDependenciesProvider],
    },
    AppointmentRepoDependenciesProvider,
  ];
}
export async function provideAppointmentRepositoryFactory(
  dependenciesProvider: AppointmentRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return new AppointmentPrismaRepository(
        dependenciesProvider.prismaService,
      );
    case DataSource.MEMORY:
    default:
      return new AppointmentInMemoryRepository();
  }
}

@Injectable()
export class AppointmentRepoDependenciesProvider {
  constructor(public prismaService: PrismaService) {}
}

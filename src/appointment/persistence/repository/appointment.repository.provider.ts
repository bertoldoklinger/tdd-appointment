import { Inject, Injectable, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataSource } from 'src/shared/database/enum/data-source.enum';
import { APPOINTMENT_REPOSITORY_TOKEN } from './appointment.repository.interface';
import { AppointmentInMemoryRepository } from './implementation/in-memory/appointment.in-memory.repository';

export function provideAppointmentRepository(): Provider[] {
  return [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useFactory: (configService: ConfigService) => {
        const dataSource = configService.get<string>('DATABASE_DATASOURCE');
        switch (dataSource) {
          case DataSource.PRISMA:
            return null;
          case DataSource.MEMORY:
          default:
            return new AppointmentInMemoryRepository();
        }
      },
      inject: [ConfigService],
    },
  ];
}
export async function provideAppointmentRepositoryFactory() {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.PRISMA:
      return null;
    case DataSource.MEMORY:
    default:
      return new AppointmentInMemoryRepository();
  }
}

@Injectable()
export class AppointmentRepoDependenciesProvider {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    public prismaAppointmentRepository: any,
  ) {}
}

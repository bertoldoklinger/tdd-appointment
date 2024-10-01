import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../typeorm/entity/appointment.entity';
import { APPOINTMENT_REPOSITORY_TOKEN } from './appointment.repository.interface';
import { AppointmentInMemoryRepository } from './implementation/in-memory/appointment.in-memory.repository';

enum DataSource {
  TYPEORM = 'TYPEORM',
  MEMORY = 'MEMORY',
}

export function provideAppointmentRepository(): Provider[] {
  return [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useFactory: (configService: ConfigService) => {
        const dataSource = configService.get<string>('DATABASE_DATASOURCE');
        switch (dataSource) {
          case DataSource.TYPEORM:
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
export async function provideAppointmentRepositoryFactory(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependenciesProvider: AppointmentRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;
  switch (process.env.DATABASE_DATASOURCE) {
    case DataSource.TYPEORM:
      return null;
    case DataSource.MEMORY:
    default:
      return new AppointmentInMemoryRepository();
  }
}

@Injectable()
export class AppointmentRepoDependenciesProvider {
  constructor(
    @InjectRepository(Appointment)
    public typeOrmRepository: Repository<Appointment>,
  ) {}
}

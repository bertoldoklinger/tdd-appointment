import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';
import { PrismaPersistenceModule } from './shared/module/persistence/prisma/prisma-persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    PrismaPersistenceModule,
    PatientModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

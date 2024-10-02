import { Injectable } from '@nestjs/common';

import { PatientModel } from 'src/patient/core/model/patient.model';
import { DefaultPrismaRepository } from 'src/shared/module/persistence/prisma/default.prisma.repository';
import { PrismaService } from 'src/shared/module/persistence/prisma/prisma.service';
import { PatientRepository } from '../patient.repository.interface';

// type QueryableFields = Prisma.$AppointmentPayload['scalars'];

@Injectable()
export class PatientPrismaRepository
  extends DefaultPrismaRepository
  implements PatientRepository
{
  private readonly model: PrismaService['patient'];
  constructor(private prismaService: PrismaService) {
    super();
    this.model = prismaService.patient;
  }

  async save(patient: PatientModel): Promise<PatientModel> {
    try {
      const newPatient = await this.model.create({
        data: patient,
      });
      return newPatient;
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async getById(patientId: string): Promise<PatientModel | undefined> {
    try {
      const patient = await this.model.findFirst({
        where: {
          patientId,
        },
      });
      if (!patient) {
        return undefined;
      }

      return PatientModel.createFrom(patient);
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.prismaService.cleanDatabase();
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }
}

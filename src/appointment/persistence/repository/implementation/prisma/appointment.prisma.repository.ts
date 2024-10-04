import { Injectable } from '@nestjs/common';
import { AppointmentModel } from 'src/appointment/core/model/appointment.model';

import { DefaultPrismaRepository } from 'src/shared/module/persistence/prisma/default.prisma.repository';
import { PrismaService } from 'src/shared/module/persistence/prisma/prisma.service';
import { AppointmentRepository } from '../../appointment.repository.interface';

// type QueryableFields = Prisma.$AppointmentPayload['scalars'];

@Injectable()
export class AppointmentPrismaRepository
  extends DefaultPrismaRepository
  implements AppointmentRepository
{
  private readonly model: PrismaService['appointment'];
  constructor(private prismaService: PrismaService) {
    super();
    this.model = prismaService.appointment;
  }

  async save(appointment: AppointmentModel): Promise<void> {
    try {
      await this.model.create({
        data: appointment,
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findOneById(
    appointmentId: string,
  ): Promise<AppointmentModel | undefined> {
    try {
      const appointment = await this.model.findFirst({
        where: {
          appointmentId,
        },
      });
      if (!appointment) {
        return undefined;
      }

      return AppointmentModel.createFrom(appointment);
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async confirm(appointment: AppointmentModel): Promise<AppointmentModel> {
    try {
      const confirmedAppointment = await this.model.update({
        where: {
          appointmentId: appointment.appointmentId,
        },
        data: {
          confirmed: true,
        },
      });

      return AppointmentModel.createFrom(confirmedAppointment);
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

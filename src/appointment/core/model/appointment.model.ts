import { randomUUID } from 'crypto';
import { WithOptional } from 'src/shared/core/type/with-optional.type';

export class AppointmentModel {
  appointmentId: string;
  startDate: Date;
  endDate: Date;
  patientId: string;
  confirmed: boolean;

  private constructor(data: AppointmentModel) {
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<AppointmentModel, 'appointmentId' | 'confirmed'>,
  ): AppointmentModel {
    return new AppointmentModel({
      ...data,
      confirmed: data.confirmed ?? false,
      appointmentId: data.appointmentId ?? randomUUID(),
    });
  }

  static createFrom(data: AppointmentModel): AppointmentModel {
    return new AppointmentModel(data);
  }
}

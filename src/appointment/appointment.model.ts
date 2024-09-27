import { randomUUID } from 'crypto';

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export class Appointment {
  appointmentId: string;
  startDate: Date;
  endDate: Date;
  patientId: string;
  confirmed: boolean;

  private constructor(data: Appointment) {
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<Appointment, 'appointmentId' | 'confirmed'>,
  ): Appointment {
    return new Appointment({
      ...data,
      confirmed: data.confirmed ?? false,
      appointmentId: data.appointmentId ?? randomUUID(),
    });
  }

  static createFrom(data: Appointment): Appointment {
    return new Appointment(data);
  }
}

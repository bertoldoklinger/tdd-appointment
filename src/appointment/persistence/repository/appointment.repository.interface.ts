import { AppointmentModel } from 'src/appointment/core/model/appointment.model';

export interface AppointmentRepository {
  save(appointment: AppointmentModel): Promise<void>;
  confirm(appointment: AppointmentModel): Promise<AppointmentModel>;
  findOneById(appointmentId: string): Promise<AppointmentModel | undefined>;
  clear(): Promise<void>;
}
export const APPOINTMENT_REPOSITORY_TOKEN = 'appointment-repository-token';

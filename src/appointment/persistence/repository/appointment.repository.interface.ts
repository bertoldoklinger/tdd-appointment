import { Appointment } from 'src/appointment/core/model/appointment.model';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  confirm(appointment: Appointment): Promise<Appointment>;
}
export const APPOINTMENT_REPOSITORY_TOKEN = 'appointment-repository-token';

import { Appointment } from 'src/appointment/core/model/appointment.model';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}
export const APPOINTMENT_REPOSITORY_TOKEN = 'appointment-repository-token';

import { Appointment } from '../appointment.model';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}
export const APPOINTMENT_REPOSITORY_TOKEN = 'appointment-repository-token';

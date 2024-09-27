import { Appointment } from '../appointment.model';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
}
export const APPOINTMENT_REPOSITORY_TOKEN = 'appointment-repository-token';

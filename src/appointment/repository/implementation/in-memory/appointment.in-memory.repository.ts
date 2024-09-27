import { Appointment } from '../../../appointment.model';
import { AppointmentRepository } from '../../appointment.repository';

export class AppointmentInMemoryRepository implements AppointmentRepository {
  public appointments: Appointment[] = [];

  async save(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }
}

import { Appointment } from 'src/appointment/core/model/appointment.model';
import { AppointmentRepository } from '../../appointment.repository.interface';

export class AppointmentInMemoryRepository implements AppointmentRepository {
  public appointments: Appointment[] = [];

  async save(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }
}

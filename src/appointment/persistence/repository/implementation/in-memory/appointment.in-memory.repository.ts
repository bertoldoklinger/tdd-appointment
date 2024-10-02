import { Appointment } from 'src/appointment/core/model/appointment.model';
import { AppointmentRepository } from '../../appointment.repository.interface';

export class AppointmentInMemoryRepository implements AppointmentRepository {
  public appointments: Appointment[] = [];

  async save(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }

  async confirm(appointment: Appointment): Promise<Appointment> {
    const appointmentFound = this.appointments.find(
      (apppointmentDb) =>
        appointment.appointmentId === apppointmentDb.appointmentId,
    );
    appointmentFound.confirmed = true;
    return appointmentFound;
  }
}

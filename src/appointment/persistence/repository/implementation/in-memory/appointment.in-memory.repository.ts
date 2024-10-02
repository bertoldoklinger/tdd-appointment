import { AppointmentModel } from 'src/appointment/core/model/appointment.model';
import { AppointmentRepository } from '../../appointment.repository.interface';

export class AppointmentInMemoryRepository implements AppointmentRepository {
  public appointments: AppointmentModel[] = [];

  async save(appointment: AppointmentModel): Promise<void> {
    this.appointments.push(appointment);
  }

  async confirm(
    appointment: AppointmentModel,
  ): Promise<AppointmentModel | undefined> {
    const appointmentFound = this.appointments.find(
      (a) => appointment.appointmentId === a.appointmentId,
    );
    if (!appointmentFound) return undefined;
    appointmentFound.confirmed = true;
    return appointmentFound;
  }

  async clear() {
    this.appointments = [];
  }
}

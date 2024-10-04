import { AppointmentModel } from 'src/appointment/core/model/appointment.model';
import { PersistenceClientException } from 'src/shared/core/exception/storage.exception';
import { AppointmentRepository } from '../../appointment.repository.interface';

export class AppointmentInMemoryRepository implements AppointmentRepository {
  public appointments: AppointmentModel[] = [];

  async save(appointment: AppointmentModel): Promise<void> {
    this.appointments.push(appointment);
  }

  async findOneById(
    appointmentId: string,
  ): Promise<AppointmentModel | undefined> {
    const appointmentFound = this.appointments.find(
      (a) => a.appointmentId === appointmentId,
    );
    if (!appointmentFound) return undefined;
    return appointmentFound;
  }

  async confirm(appointment: AppointmentModel): Promise<AppointmentModel> {
    const appointmentFound = this.appointments.find(
      (a) => appointment.appointmentId === a.appointmentId,
    );
    if (!appointmentFound)
      throw new PersistenceClientException('appointment not found');
    appointmentFound.confirmed = true;
    return appointmentFound;
  }

  async clear() {
    this.appointments = [];
  }
}

import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ScheduleAppointmentDTO {
  @IsNotEmpty()
  @IsDate()
  startDate: string;
  @IsNotEmpty()
  endDate: string;
  @IsNotEmpty()
  @IsString()
  patientId: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointmentId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  patientId: string;

  @Column({ default: false })
  confirmed: boolean;
}

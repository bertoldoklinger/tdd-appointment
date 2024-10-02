import { Test, TestingModule } from '@nestjs/testing';

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { AppointmentService } from 'src/appointment/core/service/appointment.service';
import { AppointmentController } from 'src/appointment/http/controller/appointment.controller';
import { ScheduleAppointmentDTO } from 'src/appointment/http/dto/schedule-appointment.dto';

describe('AppointmentController', () => {
  let sut: AppointmentController;
  let appointmentService: DeepMocked<AppointmentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: createMock<AppointmentService>(),
        },
      ],
    }).compile();
    sut = module.get<AppointmentController>(AppointmentController);
    appointmentService =
      module.get<DeepMocked<AppointmentService>>(AppointmentService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('register', () => {
    it('should call appointmentService.scheduleAppointment with correct params', async () => {
      const input: ScheduleAppointmentDTO = {
        startDate: new Date(),
        endDate: new Date(),
        patientId: 'any_patient_id',
      };

      await sut.scheduleAppointment(input);

      expect(appointmentService.scheduleAppointment).toHaveBeenCalledWith({
        startDate: input.startDate,
        endDate: input.endDate,
        patientId: input.patientId,
      });
      expect(appointmentService.scheduleAppointment).toHaveBeenCalledTimes(1);
    });
    it('should throw InternalServerException if appointmentService Throws', async () => {
      const input: ScheduleAppointmentDTO = {
        startDate: new Date(),
        endDate: new Date(),
        patientId: 'any_patient_id',
      };
      appointmentService.scheduleAppointment.mockRejectedValue(
        new Error("appointment's endTime should be after startTime"),
      );

      await expect(() => sut.scheduleAppointment(input)).rejects.toThrow(
        new InternalServerErrorException(
          "appointment's endTime should be after startTime",
        ),
      );
    });
  });
});

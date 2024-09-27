# Schedule Appointment Service

Service used to create an appointment.

**Service**: AppointmentService.scheduleAppointment()

**Inputs**:

- `patientId`: Unique identifier for the patient.
- `startTime`: The start time of the appointment (ISO 8601 format).
- `endTime`: The end time of the appointment (ISO 8601 format).

## Success Case

- ✅ An unconfirmed schedule is created upon successful appointment creation.
- ✅ It should persist a scheduled appointment into a storage

## Failure Cases

- ⛔ The end time is before the start time.
- ⛔ The start time and end time are not within the same day.
- ⛔ The provided patient ID is invalid.
- ⛔ The patient does not exist.
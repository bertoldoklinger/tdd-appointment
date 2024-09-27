# Schedule Appointment Endpoint

Endpoint used to create an appointment in our system.

**Endpoint**: /schedule-appointment

**Method**: POST

**Body**:

```json
{
  "patientId": "string",
  "startTime": "string (ISO 8601 format)",
  "endTime": "string (ISO 8601 format)"
}
```
Success case
✅ Returns 201 with the unconfirmed appointment is scheduled and created on success.
Exceptions:
⛔ Returns 400 when the endTime is before the startTime.
⛔ Returns 400 when the startTime and endTime are not within the same day.
⛔ Returns 400 when the patientId is invalid.
⛔ Returns 404 when the patient does not exist.
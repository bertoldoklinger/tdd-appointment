# Register Patient Service

Service used to register a patient.

**Service**: PatientService.register()

**Inputs**:

- `name`: The name of the patient
## Success Case

- ✅ Should register the patient succesfully into a storage

## Failure Cases

- ⛔ The end time is before the start time.
- ⛔ The start time and end time are not within the same day.
- ⛔ The provided patient ID is invalid.
- ⛔ The patient does not exist.
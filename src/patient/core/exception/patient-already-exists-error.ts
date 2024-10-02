export class PatientAlreadyExistsError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

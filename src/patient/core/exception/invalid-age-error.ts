export class InvalidAgeError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class InvalidDateException extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

import { DomainException } from 'src/shared/core/exception/domain.exception';

export class InvalidAgeException extends DomainException {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

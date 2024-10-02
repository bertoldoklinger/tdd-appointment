import { DomainException } from 'src/shared/core/exception/domain.exception';

export class PatientNotFoundException extends DomainException {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

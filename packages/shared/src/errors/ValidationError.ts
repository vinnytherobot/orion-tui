import { AppError } from './AppError.js';

export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

export class ValidationError extends AppError {
  public readonly fields: FieldError[];

  constructor(message: string, fields: FieldError[]) {
    super(message, 'VALIDATION_ERROR', 400);
    this.fields = fields;
  }

  static fromField(field: string, message: string, code?: string): ValidationError {
    return new ValidationError(message, [{ field, message, code }]);
  }

  static fromFields(fields: FieldError[]): ValidationError {
    const message = fields.map((f) => `${f.field}: ${f.message}`).join('; ');
    return new ValidationError(message, fields);
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }
}

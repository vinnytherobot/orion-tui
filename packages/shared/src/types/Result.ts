export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is Success<T> {
    return true;
  }

  isFail(): this is Failure<never> {
    return false;
  }
}

export class Failure<E> {
  public readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isOk(): this is Success<never> {
    return false;
  }

  isFail(): this is Failure<E> {
    return true;
  }
}

export function ok<T>(value: T): Success<T> {
  return new Success(value);
}

export function fail<E>(error: E): Failure<E> {
  return new Failure(error);
}

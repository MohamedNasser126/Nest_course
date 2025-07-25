export class WrongTaskStatusException extends Error {
  constructor() {
    super('wrong order in status');
    this.name = 'wrongTaskStatusException';
  }
}

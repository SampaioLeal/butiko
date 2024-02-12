export class ButikoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ButikoError";
  }
}

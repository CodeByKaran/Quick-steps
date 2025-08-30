export class ErrorResponse {
  success: false;
  message: string;
  reason: string;

  constructor(reason: string, message: string) {
    this.success = false;
    this.reason = reason;
    this.message = message;
  }
}

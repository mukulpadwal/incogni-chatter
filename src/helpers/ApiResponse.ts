export default class ApiResponse {
  success: boolean;
  message: string;
  data: {};

  constructor(success: boolean, message: string, data: {}) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

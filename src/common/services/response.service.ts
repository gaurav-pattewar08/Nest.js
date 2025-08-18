import { Response } from 'express';

export class ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;

  constructor(statusCode: number, message: string, success: boolean, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
    this.data = data;
  }

  static send<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200, isError: boolean = false): void {
    const response = new ApiResponse(statusCode, message, !isError, data);
    res.status(statusCode).json(response);
  }
}

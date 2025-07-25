import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  public formate(message: string): string {
    const date_now = new Date().toString();
    return `${date_now} , ${message}`;
  }
}

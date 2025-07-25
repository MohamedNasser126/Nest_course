import { Injectable } from '@nestjs/common';

import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(private messageformatter: MessageFormatterService) {}
  public log(message: string): string {
    const result = this.messageformatter.formate(message);
    console.log(message);
    return result;
  }
}

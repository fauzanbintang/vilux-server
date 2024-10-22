import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateMailDto } from 'src/dto/request/mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService,) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('AWS_HOST'),
      port: this.configService.get('AWS_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('AWS_ACCESS_KEY_ID'),
        pass: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendEmail(createMailDto: CreateMailDto): Promise<void> {
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: createMailDto.to,
      subject: createMailDto.subject,
      html: createMailDto.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent: ${info}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${createMailDto.to}`, error);
      throw new HttpException('Failed to send email', 500);
    }
  }
}

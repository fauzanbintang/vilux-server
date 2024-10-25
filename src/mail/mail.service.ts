import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateMailDto } from 'src/dto/request/mail.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { generateTokenForgot } from 'src/helpers/jwt';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
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

  async forgotPassword(email: string) {
    this.logger.debug(`Send forgot password email to ${email}`);

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User is not registered', 404);
    }

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Forgot Password',
      html: 'Forgot Password',
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent: ${info}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new HttpException('Failed to send email', 500);
    }

    const token = generateTokenForgot({ email }, this.configService);

    return {
      message: "Successfully send 'forgot password' email",
      data: { token },
      errors: null,
    }
  }
}

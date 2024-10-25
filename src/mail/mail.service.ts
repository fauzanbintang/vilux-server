import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { generateTokenMail } from 'src/helpers/jwt';
import * as fs from 'fs';
import * as path from 'path';

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

  private async getHtmlTemplate(templatePath: string, replacements: Record<string, string>): Promise<string> {
    try {
      console.log(templatePath, "ASFSFAS");

      const template = await fs.promises.readFile(templatePath, 'utf8');
      return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => replacements[key] || '');
    } catch (err) {
      this.logger.error(`Failed to load email template: ${err.message}`);
      throw new HttpException('Failed to load email template', 500);
    }
  }

  async forgotPassword(email: string) {
    this.logger.debug(`Sending forgot password email to ${email}`);

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User is not registered', 404);
    }

    const token = generateTokenMail({ email }, this.configService);
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const year = new Date().getFullYear().toString();

    const html = await this.getHtmlTemplate(
      path.join(__dirname, '..', '..', 'src', 'mail', 'templates', 'forgot-password.html'),
      { resetLink, year }
    );

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Forgot Password',
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent: ${info}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new HttpException('Failed to send email', 500);
    }

    return {
      message: "Successfully sent 'forgot password' email",
      data: { token },
      errors: null,
    };
  }

  async verifyEmail(email: string) {
    this.logger.debug(`Sending verify email to ${email}`);

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User is not registered', 404);
    }

    const token = generateTokenMail({ email }, this.configService);
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const year = new Date().getFullYear().toString();

    const html = await this.getHtmlTemplate(
      path.join(__dirname, '..', '..', 'src', 'mail', 'templates', 'verify-email.html'),
      { verificationLink, year }
    );

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Verify Email',
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent: ${info}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new HttpException('Failed to send email', 500);
    }

    return {
      message: "Successfully sent 'verify email'",
      data: { token },
      errors: null,
    };
  }
}

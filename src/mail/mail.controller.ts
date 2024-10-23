import { Controller, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMailDto } from 'src/dto/request/mail.dto';

@ApiTags('mail')
@Controller('api/mails')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    @HttpCode(201)
    @ApiOperation({ summary: 'Send an email' })
    async sendEmail(
        @Body() createMailDto: CreateMailDto
    ) {
        try {
            await this.mailService.sendEmail(createMailDto);
            return { message: `Email successfully sent to ${createMailDto.to}` };
        } catch (error) {
            return { error: 'Failed to send email', details: error.message };
        }
    }
}

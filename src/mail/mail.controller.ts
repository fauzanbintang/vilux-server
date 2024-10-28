import { Controller, Post, Body, Param, Patch, Delete, HttpCode } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMailDto } from 'src/dto/request/mail.dto';

@ApiTags('mail')
@Controller('api/mails')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('forgot-password')
    @HttpCode(201)
    @ApiOperation({ summary: 'Send email for forgot password' })
    @ApiResponse({
        status: 201,
        description: 'Email sent successfully',
        schema: {
            example: {
                message: 'Email sent successfully',
                data: { token: 'token' },
                errors: null,
            }
        }
    })
    async forgotPassword(@Body() createMailDto: CreateMailDto) {
        return await this.mailService.forgotPassword(createMailDto.email);
    }

    @Post('verify-email')
    @HttpCode(201)
    @ApiOperation({ summary: 'Send email for verify email' })
    @ApiResponse({
        status: 201,
        description: 'Email sent successfully',
        schema: {
            example: {
                message: 'Email sent successfully',
                data: { token: 'token' },
                errors: null,
            }
        }
    })
    async verifyEmail(@Body() createMailDto: CreateMailDto) {
        return await this.mailService.verifyEmail(createMailDto.email);
    }
}

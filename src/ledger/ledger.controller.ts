import { Controller, Get, HttpCode } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HomeSummaryDto } from 'src/dto/response/ledger.dto';

@ApiTags('ledger')
@Controller('api/ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('summary')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get home summary' })
  @ApiResponse({
    status: 200,
    description: 'Get home summary',
    schema: {
      example: {
        message: 'Successfully get home summary',
        data: {
          total_transaction: 1450000,
          total_user: 123,
          pending_transaction: 7,
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findAll() {
    const data: HomeSummaryDto = await this.ledgerService.getHomeSummary();

    return {
      message: 'Successfully get home summary',
      data,
      errors: null,
    };
  }
}

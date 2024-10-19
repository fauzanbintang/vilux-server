import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LedgerConst } from 'src/assets/constants';
import { PrismaService } from 'src/common/prisma.service';
import { HomeSummaryDto } from 'src/dto/response/ledger.dto';

@Injectable()
export class LedgerService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getHomeSummary(): Promise<HomeSummaryDto> {
    this.logger.debug('Get home summary');
    let res = new HomeSummaryDto();

    const total_transaction = await this.prismaService.ledger.findFirst({
      select: {
        sum_to: true,
      },
      where: {
        description: LedgerConst.ViluxMargin,
        transaction_type: LedgerConst.Margin,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const total_user = await this.prismaService.user.count();

    const pending_transaction = await this.prismaService.legitChecks.count({
      where: {
        check_status: {
          in: ['data_validation', 'legit_checking'],
        },
        watched: false,
      },
    });

    res.total_transaction = Number(total_transaction?.sum_to || 0);
    res.total_user = total_user;
    res.pending_transaction = pending_transaction;

    return res;
  }
}

import { PartialType } from '@nestjs/swagger';
import { CreateFinancialAidDiscountDto } from './create-financial-aid-discount.dto';

export class UpdateFinancialAidDiscountDto extends PartialType(CreateFinancialAidDiscountDto) {}

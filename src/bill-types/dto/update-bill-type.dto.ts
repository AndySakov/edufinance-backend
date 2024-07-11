import { PartialType } from '@nestjs/swagger';
import { CreateBillTypeDto } from './create-bill-type.dto';

export class UpdateBillTypeDto extends PartialType(CreateBillTypeDto) {}

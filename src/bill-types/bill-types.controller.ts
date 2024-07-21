import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BillTypeService } from "./bill-types.service";
import { CreateBillTypeDto } from "./dto/create-bill-type.dto";
import { UpdateBillTypeDto } from "./dto/update-bill-type.dto";

@Controller("bill-types")
export class BillTypeController {
  constructor(private readonly billTypeService: BillTypeService) {}

  @Post()
  create(@Body() createBillTypeDto: CreateBillTypeDto) {
    return this.billTypeService.create(createBillTypeDto);
  }

  @Get()
  findAll() {
    return this.billTypeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billTypeService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateBillTypeDto: UpdateBillTypeDto,
  ) {
    return this.billTypeService.update(+id, updateBillTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.billTypeService.remove(+id);
  }
}

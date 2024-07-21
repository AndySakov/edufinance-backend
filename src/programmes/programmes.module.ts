import { Module } from "@nestjs/common";
import { ProgrammesService } from "./programmes.service";
import { ProgrammesController } from "./programmes.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ProgrammesController],
  providers: [ProgrammesService],
  exports: [ProgrammesService],
})
export class ProgrammesModule {}

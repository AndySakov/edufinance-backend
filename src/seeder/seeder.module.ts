import { Module } from "@nestjs/common";
import { SeederService } from "./seeder.service";
import { SeederController } from "./seeder.controller";
import { StudentsModule } from "src/students/students.module";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { AdminsModule } from "src/admins/admins.module";
import { ProgrammesModule } from "src/programmes/programmes.module";

@Module({
  imports: [
    StudentsModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    ProgrammesModule,
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}

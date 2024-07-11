import { Injectable } from "@nestjs/common";
import { InjectMailer, Mailer } from "nestjs-mailer";

@Injectable()
export class MailService {
  constructor(
    @InjectMailer()
    private readonly mailer: Mailer,
  ) {}

  sendMail = async (mailOptions: Parameters<Mailer["sendMail"]>[0]) => {
    const util = await import("node:util");
    return util.promisify(this.mailer.sendMail)(mailOptions);
  };
}

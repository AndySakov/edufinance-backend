import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";
import * as express from "express";
import * as compression from "compression";
dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: process.env.NODE_ENV === "production" ? false : true,
    }),
  );
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    allowedHeaders: ["content-type", "authorization"],
    methods: ["GET", "OPTIONS", "POST", "DELETE", "PATCH", "PUT"],
  });
  app.use(express.json({ limit: "50mb" }));

  const config = new DocumentBuilder()
    .setTitle("EduFinance Backend")
    .setDescription(
      "This application provides all the data needed by the frontends in a unified, latency-optimised way",
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

import * as Joi from "joi";

const envSchema = Joi.object({
  ALLOWED_ORIGINS: Joi.string(),
  FE_DOMAIN: Joi.string(),
  PORT: Joi.number().default(6000),
  JWT_SECRET: Joi.string().alphanum(),
  JWT_EXPIRES_IN: Joi.string().alphanum(),
  JWT_IGNORE_EXPIRATION: Joi.boolean().default(false),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "staging")
    .default("development"),
  MAILTRAP_USER: Joi.string(),
  MAILTRAP_PASS: Joi.string(),
  MAILTRAP_PORT: Joi.number().default(2525),
  MAILTRAP_HOST: Joi.string(),
  MAILTRAP_FROM: Joi.string(),
  MAILTRAP_SECURE: Joi.boolean().default(false),
  MAGIC_LINK_SECRET: Joi.string(),
  MAGIC_LINK_EXPIRES_IN: Joi.string(),
  DB_HOST: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string(),
  DB_PORT: Joi.number().default(3306),
  SUPER_ADMIN_EMAIL: Joi.string().email(),
  SUPER_ADMIN_PASSWORD: Joi.string(),
  PAYSTACK_SECRET_KEY: Joi.string(),
  PAYSTACK_PUBLIC_KEY: Joi.string(),
  PAYSTACK_WEBHOOK_IP_WHITELIST: Joi.string(),
  CLOUDINARY_NAME: Joi.string(),
  CLOUDINARY_API_KEY: Joi.string(),
  CLOUDINARY_API_SECRET: Joi.string(),
});

export default envSchema;

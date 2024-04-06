const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    // JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
    //   .default(10)
    //   .description('minutes after which verify email token expires'),
    USER_ID: Joi.string().required().description('Sms user id'),
    API_KEY: Joi.string().required().description('Sms api key'),
    SENDER_ID: Joi.string().required().description('Sms sender id'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
})
.unknown();

const { value: envVariable, error} = envSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVariable.NODE_ENV,
    port: envVariable.PORT,
    mongoose: {
        url: envVariable.MONGODB_URL,
        options: {},
    },
    jwt: {
        secret: envVariable.JWT_SECRET,
        accessExpirationMinutes: envVariable.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVariable.JWT_REFRESH_EXPIRATION_DAYS,
    },
    sms: {
        userId: envVariable.USER_ID,
        apiKey: envVariable.API_KEY,
        senderId: envVariable.SENDER_ID,
    },
    smtp: {
        host: envVariable.SMTP_HOST,
        port: envVariable.SMTP_PORT,
        username: envVariable.SMTP_USERNAME,
        password: envVariable.SMTP_PASSWORD,
        emailFrom: envVariable.EMAIL_FROM,
    },
};
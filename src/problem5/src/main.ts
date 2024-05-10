import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { emailAndPasswordImap } from "../utility/mail-bank-listen";
// eslint-disable-next-line @typescript-eslint/no-var-requires


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('api', app, document);
  // Specify the email address you want to filter for
  await app.listen(3000);
}
bootstrap();

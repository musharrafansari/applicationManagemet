import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService); // ✅ Get ConfigService from DI

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Applicant Management API')
    .setDescription('API for managing applicants')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = configService.get<number>('PORT') || 3000; 

  await app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `✅ Server is running on http://localhost:${PORT}`);
    console.log('\x1b[34m%s\x1b[0m', `📘 Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();

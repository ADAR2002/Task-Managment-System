import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true}));
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('توثيق واجهات الـ API لمشروع NestJS')
    .setVersion('1.0').
    addBearerAuth(
      {
        type:"http",
        scheme:"bearer",
        bearerFormat:"JWT",
        name:"Authorization",
        description:"Enter JWT token",
        in:"header",
      },'jwt'
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

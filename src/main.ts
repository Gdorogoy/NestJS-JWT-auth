import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());


  const config=new DocumentBuilder()
  .setTitle('NestJs Course API')
  .setDescription('API For NestJs')
  .setVersion('1.0.0')
  .setContact('Georigy Dorogoy','github','test@gmail')
  .addBearerAuth()
  .build();

  const documnet=SwaggerModule.createDocument(app,config);

  SwaggerModule.setup('/docs',app,documnet);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

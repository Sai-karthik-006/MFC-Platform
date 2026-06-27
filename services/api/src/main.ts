import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import configuration from './config/configuration';
import { API_PREFIX } from './common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX);

  app.enableCors({
    origin: configuration().corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('MFC Platform API')
    .setDescription('Backend API for the MFC food ordering platform.')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);

  const port = configuration().port;
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}/${API_PREFIX}`);
  });

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap();

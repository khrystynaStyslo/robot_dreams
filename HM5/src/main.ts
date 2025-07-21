import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableShutdownHooks();
  
  const config = new DocumentBuilder()
    .setTitle('Tea API')
    .setDescription('Tea management API')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  process.on('SIGINT', () => {
    console.log('Bye tea‑lovers 👋');
    process.exit(0);
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

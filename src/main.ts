import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
// import { MyLoggerService } from './my-logger/my-logger.service';
// import * as fs from 'fs';

// const httpsOptions = {
//   key: fs.readFileSync('./secrets/cert.key'),
//   cert: fs.readFileSync('./secrets/cert.crt'),
// };

const allowedOrigins = ['https://example.com', 'https://another.com'];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //{httpsOptions,}
  // {
  //   bufferLogs: true,
  // }

  // app.useLogger(app.get(MyLoggerService));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors(); // open for all, if corsOption is inside that it will be limited
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

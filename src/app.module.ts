import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './mongodb/mongodb.module';
import { ConfigModule } from '@nestjs/config';
import { BusinessController } from './controllers/business/business.controller';
import { BusinessService } from './services/business/business.service';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './mongodb/schemas/business.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    MongodbModule,
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }]),
  ],
  controllers: [AppController, BusinessController],
  providers: [AppService, BusinessService],
})
export class AppModule {}

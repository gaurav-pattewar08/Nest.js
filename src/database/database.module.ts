import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'gaurav',
      database: 'postgres',
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      Logger.log('✅ Database connected successfully', 'Sequelize');
    } catch (error) {
      Logger.error('❌ Database connection failed', error, 'Sequelize');
    }
  }
}

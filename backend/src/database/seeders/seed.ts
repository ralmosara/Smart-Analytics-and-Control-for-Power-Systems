import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const seeder = app.get(SeederService);

  try {
    const command = process.argv[2];

    if (command === 'clear') {
      console.log('🗑️  Clearing database...');
      await seeder.clearAll();
      console.log('✅ Database cleared successfully');
    } else {
      console.log('🌱 Starting database seeding...');
      console.log('');

      const result = await seeder.seedAll({
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTime: new Date(),
        intervalMs: 5000, // 5 seconds between snapshots
      });

      console.log('');
      console.log('✅ Seeding complete!');
      console.log('');
      console.log('📊 Summary:');
      console.log(`   • Converter snapshots: ${result.converters.toLocaleString()}`);
      console.log(`   • Bus snapshots: ${result.buses.toLocaleString()}`);
      console.log(`   • RES snapshots: ${result.res.toLocaleString()}`);
      console.log(`   • Total records: ${(result.converters + result.buses + result.res).toLocaleString()}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGO_DB_CONNECTION || '',
  options: {
    retryWrites: true,
    w: 'majority',
  },
}));


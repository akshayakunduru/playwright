import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
export const envConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',

  webBaseUrl: process.env.WEB_BASE_URL || 'https://www.demoblaze.com',
  demoblazeUsername: process.env.DEMOBLAZE_USERNAME || 'testuser_qa',
  demoblazePassword: process.env.DEMOBLAZE_PASSWORD || 'TestPass123!',

  apiBaseUrl: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
  bookerUsername: process.env.BOOKER_USERNAME || 'admin',
  bookerPassword: process.env.BOOKER_PASSWORD || 'password123',

  timeouts: {
    test: 45000,
    expect: 10000,
    action: 10000,
    api: 15000,
  }
};

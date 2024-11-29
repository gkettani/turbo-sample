import { z } from 'zod';
import logger from './logger';

/**
 * All environment variables should be defined here for better type-safety
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
});

const processEnv = { ...process.env };

const parsed = envSchema.safeParse(processEnv);

if (parsed.success === false) {
  logger.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables');
}

export default parsed.data;

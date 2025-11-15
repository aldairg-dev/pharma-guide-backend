import { RedisManager } from "./RedisManager";

export async function initializeRedis() {
  const redisManager = RedisManager.getInstance();
  await redisManager.initialize();
  return redisManager.getClient();
}

export function getRedisClient() {
  const redisManager = RedisManager.getInstance();
  return redisManager.getClient();
}

export function isRedisConnected(): boolean {
  const redisManager = RedisManager.getInstance();
  return redisManager.isConnected();
}

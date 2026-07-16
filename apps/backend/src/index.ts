import Fastify from 'fastify';
import cors from '@fastify/cors';
import { buildDeps } from './container.js';
import { makeAuthService } from './services/auth.service.js';
import { authRoutes } from './routes/auth.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { taskRoutes } from './routes/task.routes.js';
import { agentRoutes } from './routes/agent.routes.js';
import { env } from './env.js';

// Extend Fastify types
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    user?: { id: string; name: string; email: string };
  }
}

async function main(): Promise<void> {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  // Build dependencies
  const deps = buildDeps();
  const authService = makeAuthService({ ...deps, jwtSecret: env.JWT_SECRET });

  // Register plugins
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Auth middleware
  fastify.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers.authorization;
    const apiKey = request.headers['x-api-key'] as string;

    // Skip auth for public routes
    const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/health'];
    if (publicRoutes.some(route => request.url.startsWith(route))) {
      return;
    }

    // API Key auth
    if (apiKey) {
      const user = await authService.validateApiKey(apiKey);
      if (!user) {
        return reply.status(401).send({ error: 'Invalid API key' });
      }
      request.userId = user.id;
      request.user = user;
      return;
    }

    // JWT auth
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = authService.verifyJwt(token);

      if (!payload || payload.type !== 'access') {
        return reply.status(401).send({ error: 'Invalid or expired token' });
      }

      const user = await authService.getUserById(payload.sub);
      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      request.userId = user.id;
      request.user = user;
      return;
    }

    return reply.status(401).send({ error: 'Authentication required' });
  });

  // Register routes
  await fastify.register((instance) => authRoutes(instance, deps, authService));
  await fastify.register((instance) => projectRoutes(instance, deps));
  await fastify.register((instance) => taskRoutes(instance, deps));
  await fastify.register((instance) => agentRoutes(instance, deps));

  // Health check
  fastify.get('/api/health', async () => {
    return {
      status: 'ok',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  });

  // Start server
  try {
    await fastify.listen({ port: env.PORT, host: env.HOST });
    console.log(`\n  Orion API Server running on http://${env.HOST}:${env.PORT}\n`);
    console.log('  Available endpoints:');
    console.log('    POST /api/auth/register');
    console.log('    POST /api/auth/login');
    console.log('    POST /api/auth/refresh');
    console.log('    POST /api/auth/logout');
    console.log('    GET  /api/auth/me');
    console.log('    POST /api/auth/api-keys');
    console.log('    GET  /api/auth/api-keys');
    console.log('    DELETE /api/auth/api-keys/:id');
    console.log('    GET  /api/projects');
    console.log('    POST /api/projects');
    console.log('    GET  /api/projects/:id');
    console.log('    PUT  /api/projects/:id');
    console.log('    DELETE /api/projects/:id');
    console.log('    GET  /api/tasks');
    console.log('    POST /api/tasks');
    console.log('    GET  /api/tasks/:id');
    console.log('    PUT  /api/tasks/:id');
    console.log('    DELETE /api/tasks/:id');
    console.log('    GET  /api/agents');
    console.log('    GET  /api/agents/stats');
    console.log('    POST /api/agents/:id/assign');
    console.log('    POST /api/agents/:id/complete');
    console.log('    GET  /api/health\n');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();

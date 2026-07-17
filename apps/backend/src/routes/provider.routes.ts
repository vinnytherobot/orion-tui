import type { FastifyInstance } from 'fastify';
import type { ProviderService } from '../services/provider.service.js';

export async function providerRoutes(app: FastifyInstance, providerService: ProviderService) {
  app.get('/api/providers', async (_request, reply) => {
    const providers = providerService.getAvailableProviders();
    return reply.send({ providers });
  });

  app.get('/api/provider', async (_request, reply) => {
    const current = providerService.getCurrentProvider();
    return reply.send({ provider: current });
  });

  app.post('/api/provider', async (request, reply) => {
    const { provider: name, apiKey } = request.body as { provider: string; apiKey?: string };
    
    if (!name) {
      return reply.status(400).send({ error: 'provider name is required' });
    }
    
    const result = await providerService.switchProvider(name, apiKey);
    
    if (!result.isOk()) {
      return reply.status(400).send({ error: result.error.message });
    }
    
    return reply.send({ 
      success: true, 
      provider: result.value 
    });
  });
}

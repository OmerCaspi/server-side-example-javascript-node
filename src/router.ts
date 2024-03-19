import { Router } from 'express';
import { inboundHandler } from './handlers/inbound';
import { outboundHandler } from './handlers/outbound';
import { webhookHandler } from './handlers/webhook';
import { customLLMHandler } from './handlers/custom-llm';
import { functionsCallHandler } from './handlers/functions';

const router = Router();

console.log(`In router`);

router.use((req, res, next) => {
  console.log(`Path: ${req.path}`);
  next();
});

router.post('/inbound', inboundHandler);
router.post('/outbound', outboundHandler);
router.post('/webhook', webhookHandler);

router.post('/custom-llm/basic/chat/completions', customLLMHandler.basic);
router.post(
  '/custom-llm/openai-sse/chat/completions',
  customLLMHandler.openaiSSE
);
router.post(
  '/custom-llm/openai-advanced/chat/completions',
  customLLMHandler.openaiAdvanced
);

router.post('/functions/basic', functionsCallHandler.basic);
router.post('/functions/rag', functionsCallHandler.rag);

export { router };

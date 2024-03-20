import express from 'express';
import { Router } from 'express';
import { inboundHandler } from './handlers/inbound';
import { outboundHandler } from './handlers/outbound';
import { webhookHandler } from './handlers/webhook';
import { customLLMHandler } from './handlers/custom-llm';
import { functionsCallHandler } from './handlers/functions';

const router = Router();

console.log(`In router`);

router.use(express.json()); // This line is needed to parse JSON request bodies

router.use((req, res, next) => {
  console.log(`Path: ${req.path}`);
  console.log(`Payload: ${JSON.stringify(req.body, null, 2)}`); // This line prints the request payload
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

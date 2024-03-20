import express from 'express';
import { Router } from 'express';
import { inboundHandler } from './handlers/inbound';
import { outboundHandler } from './handlers/outbound';
import { webhookHandler } from './handlers/webhook';
import { customLLMHandler } from './handlers/custom-llm';
import { functionsCallHandler } from './handlers/functions';

const router = Router();

router.use(express.json()); // This line is needed to parse JSON request bodies

router.use((req, res, next) => {

  // If message type is "status-update", log the status property
  if (req.body.message && req.body.message.type === 'status-update') {
    console.log(`Status: ${req.body.message.status}`);
  }

  // If message type is "function-call", log the call properties
  if (req.body.message && req.body.message.type === 'function-call') {
    console.log(`Function Call: ${req.body.message}\n`);
  }

  // If message type is "end-of-call-report", log endedReason property
  if (req.body.message && req.body.message.type === 'end-of-call-report') {
    console.log(`Ended Reason: ${req.body.message.endedReason}`);

    // Go over messages array, and if role is not "system" the log the role and the message properties
    if (req.body.message.messages) {
      req.body.message.messages.forEach((message: any) => {
        if (message.role !== 'system') {
          console.log(`Role: ${message.role}`);
          console.log(`Message: ${message.message}`);
        }
      });
    }
  }

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

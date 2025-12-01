import { DBOS, WorkflowQueue } from '@dbos-inc/dbos-sdk';
import { waitUntil } from '@vercel/functions';

// Define a workflow and steps
async function stepOne() {
  // Sleep 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));
  DBOS.logger.info('Step one completed!');
}

async function stepTwo() {
  // Sleep 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));
  DBOS.logger.info('Step two completed!');
}

async function exampleFunction() {
  await DBOS.runStep(() => stepOne(), { name: 'stepOne' });
  await DBOS.runStep(() => stepTwo(), { name: 'stepTwo' });
}

// Register the workflow and a queue with DBOS
DBOS.registerWorkflow(exampleFunction, {
  name: 'exampleWorkflow',
});
new WorkflowQueue('exampleQueue');

// Configure and launch DBOS. It will automatically dequeue and execute workflows.
DBOS.setConfig({
  name: 'dbos-vercel-integration',
  systemDatabaseUrl: process.env.POSTGRES_URL_NON_POOLING?.replace('?sslmode=require', ''),
  runAdminServer: false,
});
await DBOS.launch();

// After the worker Vercel function is launched,
// it waits for either all enqueued workflows
// to complete or for a timeout to be reached
async function waitForQueuedWorkflowsToComplete(timeoutMs: number): Promise<void> {
  const startTime = Date.now();
  const intervalMs = 1000;
  while (true) {
    if (Date.now() - startTime >= timeoutMs) {
      throw new Error(`Timeout reached after ${timeoutMs}ms - queued workflows still exist`);
    }
    const queuedWorkflows = await DBOS.listQueuedWorkflows({});
    if (queuedWorkflows.length === 0) {
      console.log('All queued workflows completed');
      return;
    }
    console.log(`${queuedWorkflows.length} workflows still queued, waiting...`);
    await new Promise<void>((resolve) => setTimeout(resolve, intervalMs));
  }
}

export async function GET(request: Request) {
  waitUntil(waitForQueuedWorkflowsToComplete(60000));
  return new Response(`Starting DBOS worker! Request URL: ${request.url}`);
}

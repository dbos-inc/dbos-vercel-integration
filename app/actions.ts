'use server';

import { DBOSClient } from '@dbos-inc/dbos-sdk';

async function withClient<T>(callback: (client: DBOSClient) => Promise<T>): Promise<T> {
  const databaseURL = process.env.POSTGRES_URL_NON_POOLING?.replace('?sslmode=require', '');
  if (!databaseURL) {
    throw Error('Database URL not defined');
  }
  const client = await DBOSClient.create({ systemDatabaseUrl: databaseURL });
  try {
    return await callback(client);
  } finally {
    await client.destroy();
  }
}

export async function enqueueWorkflow() {
  console.log('Enqueueing DBOS workflow');
  return withClient(async (client) => {
    await client.enqueue({
      workflowName: 'exampleWorkflow',
      queueName: 'exampleQueue',
    });
  });
}

export async function listWorkflows() {
  console.log('Listing DBOS workflows');
  return withClient(async (client) => {
    return await client.listWorkflows({
      workflowName: 'exampleWorkflow',
      sortDesc: true,
    });
  });
}

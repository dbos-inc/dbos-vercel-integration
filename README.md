This is a reference showing how to run durable background tasks on Vercel using DBOS.

## How it Works

This app contains a Next.js frontend and a serverless Vercel Functions "backend" that runs durable background workflows.

The Next.js frontend uses a [DBOS Client](https://docs.dbos.dev/typescript/reference/client) (backed by Postgres) to enqueue workflows and display workflow status.

Periodically, a worker running in a Vercel Function checks if there are any enqueued workflows and executes them.
This worker is triggered automatically by a Vercel cron, but can also be triggered through a button in the app.

Note that the cron schedule is set to once a day because of free tier limitations, but on non-free plans you can set it to run as often as you want (We'd recommend once a minute).

## How to Run

Import this repository as a Vercel project and connect it to a Supabase database. It should just work!

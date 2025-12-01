'use client';

import { enqueueWorkflow, listWorkflows } from './actions';
import { useEffect, useState } from 'react';
import { WorkflowStatus } from '@dbos-inc/dbos-sdk';

export default function Home() {
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [enqueueing, setEnqueueing] = useState(false);
  const [startingWorker, setStartingWorker] = useState(false);

  const fetchWorkflows = async () => {
    try {
      const data = await listWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleEnqueue = async () => {
    setEnqueueing(true);
    try {
      await enqueueWorkflow();
      await fetchWorkflows();
    } catch (error) {
      console.error('Failed to enqueue workflow:', error);
    } finally {
      setEnqueueing(false);
    }
  };

  const handleStartWorker = async () => {
    setStartingWorker(true);
    try {
      const response = await fetch('/api/dbos');
      const data = await response.text();
      console.log('API response:', data);
    } catch (error) {
      console.error('Failed to start worker:', error);
    } finally {
      setStartingWorker(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'enqueued':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (epochMs: number) => {
    const date = new Date(epochMs);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Vercel + DBOS Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Run durable background workflows from your Vercel app
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={handleEnqueue}
            disabled={enqueueing}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center gap-2">
              {enqueueing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enqueueing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Enqueue Workflow
                </>
              )}
            </span>
          </button>

          <button
            onClick={handleStartWorker}
            disabled={startingWorker}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center gap-2">
              {startingWorker ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start Worker
                </>
              )}
            </span>
          </button>
        </div>

        {/* Workflows List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Workflows</h2>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Auto-updating
              </div>
            </div>
            <p className="text-slate-400 mt-1">
              {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">Loading workflows...</p>
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No workflows yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Get started by enqueueing your first workflow</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.workflowID}
                    className="group relative bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-900 dark:to-slate-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Workflow ID</h3>
                        </div>
                        <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100 truncate mb-2">
                          {workflow.workflowID}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Started {formatTimestamp(workflow.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(
                            workflow.status,
                          )}`}
                        >
                          {workflow.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">Powered by DBOS</div>
      </div>
    </div>
  );
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  TICKETS: `${API_BASE_URL}/tickets`,
  TICKETS_STATS: `${API_BASE_URL}/tickets/stats/overview`,
  QUEUE_JOBS: `${API_BASE_URL}/queue`,
  ADMIN_QUEUE_STATS: `${API_BASE_URL}/admin/queues`,
} as const;

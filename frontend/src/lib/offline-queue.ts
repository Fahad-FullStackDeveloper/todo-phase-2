/**
 * Offline Queue Utility
 *
 * Manages offline operations and syncs when reconnected
 */

interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

const QUEUE_KEY = 'todo_offline_queue';
const MAX_RETRIES = 3;

/**
 * Get queued operations
 */
export function getQueuedOperations(): QueuedOperation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
}

/**
 * Save queued operations
 */
function saveQueue(queue: QueuedOperation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Add operation to queue
 */
export function queueOperation(
  type: QueuedOperation['type'],
  endpoint: string,
  data?: any
): string {
  const operation: QueuedOperation = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    endpoint,
    data,
    timestamp: Date.now(),
    retryCount: 0,
  };

  const queue = getQueuedOperations();
  queue.push(operation);
  saveQueue(queue);

  return operation.id;
}

/**
 * Remove operation from queue
 */
export function removeOperation(id: string): void {
  const queue = getQueuedOperations();
  const filtered = queue.filter(op => op.id !== id);
  saveQueue(filtered);
}

/**
 * Get pending operations count
 */
export function getPendingCount(): number {
  return getQueuedOperations().length;
}

/**
 * Clear all operations
 */
export function clearQueue(): void {
  saveQueue([]);
}

/**
 * Process queue when back online
 */
export async function processQueue(
  processor: (op: QueuedOperation) => Promise<void>
): Promise<{ success: number; failed: number }> {
  const queue = getQueuedOperations();
  let success = 0;
  let failed = 0;

  for (const operation of queue) {
    try {
      await processor(operation);
      removeOperation(operation.id);
      success++;
    } catch (error) {
      // Increment retry count
      operation.retryCount++;
      
      if (operation.retryCount >= MAX_RETRIES) {
        removeOperation(operation.id);
        failed++;
      } else {
        // Update operation in queue
        const updatedQueue = queue.map(op =>
          op.id === operation.id ? operation : op
        );
        saveQueue(updatedQueue);
      }
    }
  }

  return { success, failed };
}

/**
 * Cache data for offline viewing
 */
const CACHE_KEY = 'todo_offline_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface OfflineCache {
  tasks: any[];
  projects: any[];
  labels: any[];
  timestamp: number;
}

/**
 * Cache data for offline use
 */
export function cacheData(data: OfflineCache): void {
  if (typeof window === 'undefined') return;
  data.timestamp = Date.now();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

/**
 * Get cached data
 */
export function getCachedData(): OfflineCache | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: OfflineCache = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - data.timestamp > CACHE_EXPIRY) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Check if we have valid offline data
 */
export function hasValidOfflineData(): boolean {
  return getCachedData() !== null;
}

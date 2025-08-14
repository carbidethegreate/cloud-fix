import type { PagesProjectInfo, Report, WorkerInfo } from '../types';

export function useDiagnostics(token: string | null, accountId: string | null) {
  async function generate(selectedWorkers: string[], selectedPages: string[]): Promise<Report> {
    if (!token || !accountId) throw new Error('Missing token or account');

    const workers: WorkerInfo[] = selectedWorkers.map((name) => ({ name }));
    const pages: PagesProjectInfo[] = selectedPages.map((name) => ({ name }));

    return {
      generatedAt: new Date().toISOString(),
      accountId,
      workers,
      pages,
      summary: {
        totals: {
          workersSelected: workers.length,
          pagesSelected: pages.length,
          requests24h: 0,
          requests7d: 0,
          avgErrorRate24h: 0,
        },
        flags: [],
      },
    };
  }

  return { generate };
}

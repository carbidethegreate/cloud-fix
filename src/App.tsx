import { useState } from 'react';
import { TokenGate } from './components/TokenGate';
import { Sidebar } from './components/Sidebar';
import { ReportView } from './components/ReportView';
import { useCloudflareApi } from './hooks/useCloudflareApi';
import { useDiagnostics } from './hooks/useDiagnostics';
import type { Report } from './types';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [accountId, setAccountId] = useState<string | null>(null);
  const api = useCloudflareApi(token);
  const diag = useDiagnostics(token, accountId);

  const [workers, setWorkers] = useState<{ name: string; subtitle?: string }[]>([]);
  const [pages, setPages] = useState<{ name: string; subtitle?: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set());
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [report, setReport] = useState<Report | null>(null);

  const connect = async (t: string) => {
    try {
      setToken(t);
      const accounts = await api.getAccounts();
      if (accounts.length === 0) throw new Error('No accounts');
      const account = accounts[0];
      setAccountId(account.id);
      setStatus('connected');
      const [ws, ps] = await Promise.all([
        api.getWorkers(account.id),
        api.getPagesProjects(account.id),
      ]);
      setWorkers(ws.map((w) => ({ name: w.name, subtitle: w.modified_on })));
      setPages(ps.map((p) => ({ name: p.name })));
    } catch (e) {
      console.error(e);
      setStatus('disconnected');
      alert('Failed to connect');
    }
  };

  const toggleWorker = (name: string) => {
    const next = new Set(selectedWorkers);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setSelectedWorkers(next);
  };
  const togglePage = (name: string) => {
    const next = new Set(selectedPages);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setSelectedPages(next);
  };

  const selectAllWorkers = (checked: boolean) => {
    setSelectedWorkers(checked ? new Set(workers.map((w) => w.name)) : new Set());
  };
  const selectAllPages = (checked: boolean) => {
    setSelectedPages(checked ? new Set(pages.map((p) => p.name)) : new Set());
  };

  const generateReport = async () => {
    const rep = await diag.generate(Array.from(selectedWorkers), Array.from(selectedPages));
    setReport(rep);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-2 bg-blue-700 text-white">
        <h1 className="text-lg font-semibold">Cloudflare Diagnostic</h1>
        <span
          className={`px-2 py-1 rounded text-sm ${
            status === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {status === 'connected' ? 'Connected' : 'Not connected'}
        </span>
      </header>
      <div className="flex flex-1">
        {status === 'connected' ? (
          <Sidebar
            workers={workers}
            pages={pages}
            selectedWorkers={selectedWorkers}
            selectedPages={selectedPages}
            onToggleWorker={toggleWorker}
            onTogglePage={togglePage}
            selectAllWorkers={selectAllWorkers}
            selectAllPages={selectAllPages}
            search={search}
            onSearch={setSearch}
          />
        ) : null}
        <main className="flex-1 p-4 flex flex-col">
          {status !== 'connected' && <TokenGate onConnect={connect} />}
          {status === 'connected' && !report && (
            <div className="mb-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={selectedWorkers.size + selectedPages.size === 0}
                onClick={generateReport}
              >
                Full Report
              </button>
            </div>
          )}
          {report && <ReportView report={report} />}
        </main>
      </div>
      <footer className="text-center text-xs text-gray-500 py-2">
        Remember to reset your API key by April 4, 2026.
      </footer>
    </div>
  );
}

export default App;

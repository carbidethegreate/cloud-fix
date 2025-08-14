import { useState } from 'react';
import type { Report } from '../types';
import { downloadBlob } from '../utils/download';

interface Props {
  report: Report;
}

export function ReportView({ report }: Props) {
  const [tab, setTab] = useState<'summary' | 'details' | 'errors'>('summary');

  const exportJson = () =>
    downloadBlob('report.json', 'application/json', JSON.stringify(report, null, 2));
  const exportMarkdown = () => {
    const lines = [
      '# Diagnostic Report',
      `Generated at ${report.generatedAt}`,
      `Workers selected: ${report.summary.totals.workersSelected}`,
      `Pages selected: ${report.summary.totals.pagesSelected}`,
    ];
    downloadBlob('report.md', 'text/markdown', lines.join('\n'));
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1 border rounded ${tab === 'summary' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setTab('summary')}
        >
          Summary
        </button>
        <button
          className={`px-3 py-1 border rounded ${tab === 'details' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setTab('details')}
        >
          Details
        </button>
        <button
          className={`px-3 py-1 border rounded ${tab === 'errors' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setTab('errors')}
        >
          Errors
        </button>
        <div className="flex-1" />
        <button className="px-2 py-1 border rounded" onClick={exportJson}>
          Export JSON
        </button>
        <button className="px-2 py-1 border rounded" onClick={exportMarkdown}>
          Export Markdown
        </button>
      </div>
      {tab === 'summary' && (
        <div>
          <p>Workers selected: {report.summary.totals.workersSelected}</p>
          <p>Pages selected: {report.summary.totals.pagesSelected}</p>
        </div>
      )}
      {tab === 'details' && (
        <div>
          <h3 className="font-semibold mb-2">Workers</h3>
          <ul className="mb-4 list-disc list-inside">
            {report.workers.map((w) => (
              <li key={w.name}>{w.name}</li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Pages</h3>
          <ul className="list-disc list-inside">
            {report.pages.map((p) => (
              <li key={p.name}>{p.name}</li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'errors' && <div>No errors available.</div>}
    </div>
  );
}

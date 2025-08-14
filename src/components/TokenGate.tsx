import { useState } from 'react';

interface Props {
  onConnect: (token: string) => void;
}

export function TokenGate({ onConnect }: Props) {
  const [token, setToken] = useState('');

  return (
    <div className="p-4 bg-white rounded shadow max-w-sm">
      <label className="block text-sm font-medium mb-1" htmlFor="token">
        API Token
      </label>
      <input
        id="token"
        type="password"
        className="w-full border rounded px-2 py-1"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        className="mt-3 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        onClick={() => token && onConnect(token)}
        disabled={!token}
      >
        OK
      </button>
    </div>
  );
}

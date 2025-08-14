export function useCloudflareApi(token: string | null) {
  const base = 'https://api.cloudflare.com/client/v4';

  async function request(path: string, init?: RequestInit) {
    if (!token) throw new Error('No token');
    const res = await fetch(`${base}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...init,
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
  }

  async function getAccounts() {
    const data = await request('/accounts');
    return data.result as { id: string; name: string }[];
  }

  async function getWorkers(accountId: string) {
    const data = await request(`/accounts/${accountId}/workers/scripts`);
    return data.result as { id?: string; name: string; modified_on?: string }[];
  }

  async function getPagesProjects(accountId: string) {
    const data = await request(`/accounts/${accountId}/pages/projects`);
    return data.result as { id?: string; name: string }[];
  }

  return { getAccounts, getWorkers, getPagesProjects };
}

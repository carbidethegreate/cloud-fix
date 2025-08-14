interface Item { name: string; subtitle?: string }

interface Props {
  workers: Item[];
  pages: Item[];
  selectedWorkers: Set<string>;
  selectedPages: Set<string>;
  onToggleWorker: (name: string) => void;
  onTogglePage: (name: string) => void;
  selectAllWorkers: (checked: boolean) => void;
  selectAllPages: (checked: boolean) => void;
  search: string;
  onSearch: (s: string) => void;
}

export function Sidebar({
  workers,
  pages,
  selectedWorkers,
  selectedPages,
  onToggleWorker,
  onTogglePage,
  selectAllWorkers,
  selectAllPages,
  search,
  onSearch,
}: Props) {
  const filter = (items: Item[]) =>
    items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="w-64 p-4 bg-gray-100 overflow-y-auto">
      <input
        type="text"
        className="w-full mb-3 border rounded px-2 py-1"
        placeholder="Search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Workers</h2>
          <label className="text-sm">
            <input
              type="checkbox"
              className="mr-1"
              checked={selectedWorkers.size === workers.length && workers.length > 0}
              onChange={(e) => selectAllWorkers(e.target.checked)}
            />
            All
          </label>
        </div>
        <ul className="space-y-1">
          {filter(workers).map((w) => (
            <li key={w.name} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedWorkers.has(w.name)}
                onChange={() => onToggleWorker(w.name)}
              />
              <span className="flex-1">
                {w.name}
                {w.subtitle && <span className="block text-xs text-gray-500">{w.subtitle}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Pages</h2>
          <label className="text-sm">
            <input
              type="checkbox"
              className="mr-1"
              checked={selectedPages.size === pages.length && pages.length > 0}
              onChange={(e) => selectAllPages(e.target.checked)}
            />
            All
          </label>
        </div>
        <ul className="space-y-1">
          {filter(pages).map((p) => (
            <li key={p.name} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedPages.has(p.name)}
                onChange={() => onTogglePage(p.name)}
              />
              <span className="flex-1">
                {p.name}
                {p.subtitle && <span className="block text-xs text-gray-500">{p.subtitle}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

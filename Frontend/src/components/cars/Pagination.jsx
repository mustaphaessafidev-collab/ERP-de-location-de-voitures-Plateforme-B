export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-semibold transition ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}
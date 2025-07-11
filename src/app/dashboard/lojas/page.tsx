"use client";
import { apiDelete, apiGet } from "@/app/utils/api";
import { API_ROUTES } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const columns = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "instagram", label: "Instagram" },
  { key: "local", label: "Local" }, // Added Local column
];

function sortData(data: any, sortBy: any, sortOrder: any) {
  return [...data].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (Array.isArray(aValue)) aValue = aValue.join(", ");
    if (Array.isArray(bValue)) bValue = bValue.join(", ");

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}

export default function lojasPage() {
  const [data, setData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        search: search,
      });
      const response = await apiGet<any>(
        `${API_ROUTES.LOJAS}?${params.toString()}`
      );
      setTotalPages(response.totalPages);
      setData(response.data);
      setTotal(response.total);
    };
    loadData();
  }, [page, size, search]);

  const handleSort = (key: any) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: any) => {
    await apiDelete<any>(`${API_ROUTES.LOJAS}/${id.toString()}`);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id: any) => {
    router.push(`/dashboard/lojas/${id}`);
  };

  const sortedData = sortData(data, sortBy, sortOrder);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Minhas lojas</h1>
      <div className="flex justify-between gap-10">
        <input
          type="text"
          placeholder="Pesquisar excursão..."
          className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Volta para a primeira página ao pesquisar
          }}
        />
        <button
          className="flex bg-blue-800 p-1 px-10 rounded-sm justify-center items-center"
          onClick={() => router.push("/dashboard/lojas/gerenciar")}
        >
          Criar
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.key && (
                      <span>
                        {sortOrder === "asc" ? (
                          <svg
                            className="w-3 h-3 inline"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3 h-3 inline"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100 text-black">
            {sortedData.map((loja) => (
              <tr key={loja.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2">{loja.id}</td>
                <td className="px-4 py-2">{loja.nome}</td>
                <td className="px-4 py-2">{loja.whatsapp}</td>
                <td className="px-4 py-2">{loja.instagram}</td>
                <td className="px-4 py-2">{loja.local}</td>{" "}
                {/* Display Local data */}
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(loja.id)}
                    className="p-2 rounded hover:bg-blue-100 text-blue-700"
                    title="Editar"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(loja.id)}
                    className="p-2 rounded hover:bg-red-100 text-red-600"
                    title="Deletar"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-blue-400"
                >
                  Nenhuma loja encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4 text-gray-800">
        <div>
          Página {page} de {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-blue-200 text-blue-800 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 rounded bg-blue-200 text-blue-800 disabled:opacity-50"
          >
            Próxima
          </button>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1); // Volta para a primeira página ao mudar o tamanho
            }}
            className="ml-4 border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} por página
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

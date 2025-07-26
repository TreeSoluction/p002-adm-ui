"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/utils/api";
import { API_ROUTES } from "@/app/utils/routes"; // Importe API_ROUTES para usar API_ROUTES.CATEGORIAS

const estados = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export default function Page({ params }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    imagem: "",
    estado: "",
    categorias: [] as string[], // Novo campo para as categorias da cidade
  });
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<any[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const responseCategorias = await apiGet<any>(
          `${API_ROUTES.CATEGORIAS}?page=1&size=9999`
        );
        setCategoriasDisponiveis(responseCategorias.data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias disponíveis:", error);
      }

      if (hasValidId(params.id)) {
        try {
          const result = await apiGet<any>(`/cidades/${params.id}`);
          setForm({
            nome: result.nome || "",
            imagem: result.imagem || "",
            estado: result.estado || "",
            categorias: result.categorias.map((x: any) => x.nome) || [],
          });
        } catch (error) {
          console.error("Erro ao carregar dados da cidade:", error);
        }
      }
    };

    loadData();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imagem: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategoria = () => {
    if (selectedCategoria && !form.categorias.includes(selectedCategoria)) {
      setForm((prevForm) => ({
        ...prevForm,
        categorias: [...prevForm.categorias, selectedCategoria],
      }));
      setSelectedCategoria(""); // Limpa a seleção do dropdown
    }
  };

  const handleRemoveCategoria = (categoriaToRemove: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      categorias: prevForm.categorias.filter(
        (cat) => cat !== categoriaToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (hasValidId(params.id)) {
        await apiPut<any>(`/cidades/${params.id}`, form);
      } else {
        await apiPost<any>("/cidades", form);
      }
      router.push("/dashboard/cidades");
    } catch (e) {
      console.error(e);
    }
  };

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .slice(0, 15);
  }

  function hasValidId(id: any) {
    if (isNaN(id)) {
      return false;
    }
    return id && id !== "" && id !== "undefined" && id !== "null";
  }

  const categoriasParaDropdown = categoriasDisponiveis.filter(
    (cat) => !form.categorias.includes(cat.nome)
  );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">
        {hasValidId(params.id) ? "Editar Cidade" : "Nova Cidade"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Estado</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="" disabled>
              Selecione um estado
            </option>
            {estados.map((estado) => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Novo campo de Categorias */}
        <div>
          <label className="block font-semibold mb-1">Categorias</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.categorias.map((categoria) => (
              <span
                key={categoria}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {categoria}
                <button
                  type="button"
                  onClick={() => handleRemoveCategoria(categoria)}
                  className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="flex-grow border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Adicionar categoria...
              </option>
              {categoriasParaDropdown.map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddCategoria}
              disabled={!selectedCategoria}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {form.imagem && (
            <div className="mt-2">
              <img
                src={form.imagem}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition"
        >
          {hasValidId(params.id) ? "Salvar alterações" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
    .slice(0, 15);
}

function hasValidId(id: any) {
  if (isNaN(id)) {
    return false;
  }
  return id && id !== "" && id !== "undefined" && id !== "null";
}

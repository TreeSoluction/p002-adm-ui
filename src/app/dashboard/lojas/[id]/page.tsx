"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/utils/api";
import { API_ROUTES } from "@/app/utils/routes"; // Importe API_ROUTES

export default function Page({ params }: any) {
  const router = useRouter();
  const [cidades, setCidades] = useState<any[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<any[]>([]); // Novo estado para categorias

  const [form, setForm] = useState<{
    nome: string;
    imagem: string;
    categoria: string; // Continua sendo uma string para uma única categoria
    cidade: string;
    produtos: string[];
    whatsapp: string;
    instagram: string;
    local: string;
  }>({
    nome: "",
    categoria: "",
    imagem: "",
    cidade: "",
    produtos: [],
    whatsapp: "",
    instagram: "",
    local: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      // Carrega as cidades
      try {
        const resultCidades = await apiGet<any>("/cidades?size=1000&page=0");
        setCidades(resultCidades.data);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }

      // Carrega as categorias disponíveis
      try {
        const responseCategorias = await apiGet<any>(
          `${API_ROUTES.CATEGORIAS}?page=1&size=9999`
        );
        setCategoriasDisponiveis(responseCategorias.data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias disponíveis:", error);
      }

      // Carrega os dados da loja se for uma edição
      if (hasValidId(params.id)) {
        try {
          const resultLoja = await apiGet<any>(`/lojas/${params.id}`);
          setForm({
            nome: resultLoja.nome || "",
            categoria: resultLoja.categoria || "",
            cidade: resultLoja.cidade || "",
            imagem: resultLoja.imagem || "",
            produtos: resultLoja.produtos || [],
            whatsapp: resultLoja.whatsapp || "",
            instagram: resultLoja.instagram || "",
            local: resultLoja.local || "",
          });
        } catch (error) {
          console.error("Erro ao carregar dados da loja:", error);
        }
      }
    };

    loadInitialData();
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
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagem: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProdutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((images) => {
        setForm((prev) => ({ ...prev, produtos: images }));
      })
      .catch((err) => {
        console.error("Erro ao ler arquivos de produtos:", err);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (hasValidId(params.id)) {
        await apiPut<any>(`/lojas/${params.id}`, form);
      } else {
        await apiPost<any>("/lojas", form);
      }
      router.push("/dashboard/lojas");
    } catch (err) {
      console.error(err);
    }
  };

  function hasValidId(id: any) {
    if (isNaN(id)) return false;
    return id && id !== "" && id !== "undefined" && id !== "null";
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">
        {hasValidId(params.id) ? "Editar Loja" : "Nova Loja"}
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

        {/* Campo Categoria - Agora dinâmico e de seleção única */}
        <div>
          <label className="block font-semibold mb-1">Categoria</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categoriasDisponiveis.map((categoria) => (
              <option key={categoria.id} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Cidade</label>
          <select
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecione uma cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Local</label>
          <input
            type="text"
            name="local"
            value={form.local}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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

        <div>
          <label className="block font-semibold mb-1">
            Produtos (várias imagens)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleProdutosChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {form.produtos.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {form.produtos.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Produto ${idx + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ))}
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

function hasValidId(id: any) {
  if (isNaN(id)) return false;
  return id && id !== "" && id !== "undefined" && id !== "null";
}

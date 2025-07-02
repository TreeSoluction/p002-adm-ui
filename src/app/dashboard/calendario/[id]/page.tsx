"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/utils/api";

export default function Page({ params }: any) {
  const router = useRouter();
  const [cidades, setCidades] = useState<any[]>([]);
  const [form, setForm] = useState({
    data: "",
    imagem: "",
    titulo: "", // Adicionado
    cidade: "", // Adicionado
  });

  useEffect(() => {
    const loadInitialData = async () => {
      // Carrega as cidades para o dropdown
      try {
        const resultCidades = await apiGet<any>("/cidades?size=1000&page=0");
        setCidades(resultCidades.data);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }

      // Se for uma edição, carrega os dados do calendário existente
      if (hasValidId(params.id)) {
        try {
          const resultCalendario = await apiGet<any>(
            `/calendario/${params.id}`
          );
          setForm({
            data: resultCalendario.data?.split("T")[0] || "", // Formata a data
            imagem: resultCalendario.imagem || "",
            titulo: resultCalendario.titulo || "",
            cidade: resultCalendario.cidade || "",
          });
        } catch (error) {
          console.error("Erro ao carregar dados do calendário:", error);
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imagem: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...form,
        // Garante que a data seja enviada no formato ISO com timezone Z
        data: form.data ? `${form.data}T00:00:00Z` : null,
      };

      if (hasValidId(params.id)) {
        await apiPut<any>(`/calendario/${params.id}`, dataToSend);
      } else {
        await apiPost<any>("/calendario", dataToSend);
      }
      router.push("/dashboard/calendario");
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  function hasValidId(id: any) {
    if (isNaN(id)) {
      return false;
    }
    return id && id !== "" && id !== "undefined" && id !== "null";
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">
        {hasValidId(params.id) ? "Editar Evento" : "Novo Evento"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
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
          <label className="block font-semibold mb-1">Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
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

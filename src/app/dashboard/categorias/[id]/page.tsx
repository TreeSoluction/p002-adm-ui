"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/utils/api";

export default function Page({ params }: any) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    imagem: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (hasValidId(params.id)) {
        const result = await apiGet<any>(`/categorias/${params.id}`);
        setForm({
          nome: result.nome || "",
          imagem: result.imagem || "",
        });
      }
    };

    loadData();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      if (hasValidId(params.id)) {
        await apiPut<any>(`/categorias/${params.id}`, form);
      } else {
        await apiPost<any>("/categorias", form);
      }
      router.push("/dashboard/categorias"); // Redireciona para a lista de categorias
    } catch (e) {
      console.error(e);
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
        {hasValidId(params.id) ? "Editar Categoria" : "Nova Categoria"}
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

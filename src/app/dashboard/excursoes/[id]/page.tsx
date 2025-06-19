"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { estadosBrasil } from "@/app/const";
import { apiGet, apiPost, apiPut } from "@/app/utils/api";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    estado: "",
    origem: "",
    rota: [""],
    phone_numbers: [""],
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await apiGet<any>(`/excursoes/${params.id}`);
      setForm({
        nome: result.nome || "",
        descricao: result.descricao || "",
        estado: result.estado || "",
        origem: result.origem || "",
        rota: result.rota && result.rota.length > 0 ? result.rota : [""],
        phone_numbers:
          result.phone_numbers && result.phone_numbers.length > 0
            ? result.phone_numbers
            : [""],
      });
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "rota" | "phone_numbers",
    idx: number
  ) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };

  const addField = (field: "rota" | "phone_numbers") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeField = (field: "rota" | "phone_numbers", idx: number) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (params.id) {
        await apiPut<any>(`/excursoes/${params.id}`, form);
      } else {
        await apiPost<any>("/excursoes", form);
      }
      router.push("/dashboard/excursoes");
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

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">
        {params.id ? "Editar Excursão" : "Nova Excursão"}
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
          <label className="block font-semibold mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
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
            className="w-full border border-blue-200 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecione o estado</option>
            {estadosBrasil.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Origem</label>
          <input
            type="text"
            name="origem"
            value={form.origem}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Rota</label>
          {form.rota.map((rota, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={rota}
                onChange={(e) => handleArrayChange(e, "rota", idx)}
                className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {form.rota.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField("rota", idx)}
                  className="ml-2 text-blue-600 hover: font-bold"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("rota")}
            className="hover:text-blue-900 mt-1 font-semibold"
          >
            + Adicionar rota
          </button>
        </div>
        <div>
          <label className="block font-semibold mb-1">Telefones</label>
          {form.phone_numbers.map((phone, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  handleArrayChange(
                    {
                      ...e,
                      target: {
                        ...e.target,
                        value: formatPhone(e.target.value),
                      },
                    },
                    "phone_numbers",
                    idx
                  )
                }
                className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {form.phone_numbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField("phone_numbers", idx)}
                  className="ml-2 text-blue-600 hover: font-bold"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("phone_numbers")}
            className="hover:text-blue-900 mt-1 font-semibold"
          >
            + Adicionar telefone
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition"
        >
          {params.id ? "Salvar alterações" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

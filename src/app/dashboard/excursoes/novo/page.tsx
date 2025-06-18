"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { estadosBrasil } from "@/app/const";

export default function NovaExcursaoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    estado: "",
    origem: "",
    rota: [""],
    phone_numbers: [""],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, field, idx) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };

  const addField = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeField = (field, idx) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode fazer a requisição para criar a excursão
    // await fetch('/api/excursoes', { method: 'POST', body: JSON.stringify(form) });
    router.push("/dashboard/excursoes");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Nova Excursão</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Nome</label>
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
          <label className="block font-semibold text-blue-800 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">
            Estado
          </label>
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
          <label className="block font-semibold text-blue-800 mb-1">
            Origem
          </label>
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
          <label className="block font-semibold text-blue-800 mb-1">Rota</label>
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
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("rota")}
            className="text-blue-700 hover:text-blue-900 mt-1 font-semibold"
          >
            + Adicionar rota
          </button>
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">
            Telefones
          </label>
          {form.phone_numbers.map((phone, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handleArrayChange(e, "phone_numbers", idx)}
                className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              {form.phone_numbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField("phone_numbers", idx)}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("phone_numbers")}
            className="text-blue-700 hover:text-blue-900 mt-1 font-semibold"
          >
            + Adicionar telefone
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}

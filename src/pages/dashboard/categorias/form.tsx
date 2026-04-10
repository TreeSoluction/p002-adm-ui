import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "@/utils/api";

function hasValidId(id: any) { if (isNaN(id)) return false; return id && id !== "" && id !== "undefined" && id !== "null"; }

export default function CategoriasFormPage() {
  const navigate = useNavigate(); const { id } = useParams();
  const [form, setForm] = useState({ nome: "", imagem: "" });

  useEffect(() => {
    const loadData = async () => { if (hasValidId(id)) { const result = await apiGet<any>(`/categorias/${id}`); setForm({ nome: result.nome || "", imagem: result.imagem || "" }); } };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setForm({ ...form, imagem: reader.result as string }); reader.readAsDataURL(file); } };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (hasValidId(id)) { await apiPut<any>(`/categorias/${id}`, form); } else { await apiPost<any>("/categorias", form); } navigate("/dashboard/categorias"); } catch (e) { console.error(e); } };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">{hasValidId(id) ? "Editar Categoria" : "Nova Categoria"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block font-semibold mb-1">Nome</label><input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">Imagem</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.imagem && (<div className="mt-2"><img src={form.imagem} alt="Preview" className="max-w-full h-32 object-cover rounded border" /></div>)}</div>
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition">{hasValidId(id) ? "Salvar alterações" : "Salvar"}</button>
      </form>
    </div>
  );
}

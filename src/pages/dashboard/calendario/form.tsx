import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "@/utils/api";

function hasValidId(id: any) { if (isNaN(id)) return false; return id && id !== "" && id !== "undefined" && id !== "null"; }

export default function CalendarioFormPage() {
  const navigate = useNavigate(); const { id } = useParams();
  const [cidades, setCidades] = useState<any[]>([]);
  const [form, setForm] = useState({ data: "", imagem: "", titulo: "", cidade: "" });

  useEffect(() => {
    const loadInitialData = async () => {
      try { const r = await apiGet<any>("/cidades?size=1000&page=0"); setCidades(r.data); } catch (e) { console.error("Erro ao carregar cidades:", e); }
      if (hasValidId(id)) { try { const r = await apiGet<any>(`/calendario/${id}`); setForm({ data: r.data?.split("T")[0] || "", imagem: r.imagem || "", titulo: r.titulo || "", cidade: r.cidade || "" }); } catch (e) { console.error(e); } }
    };
    loadInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setForm({ ...form, imagem: reader.result as string }); reader.readAsDataURL(file); } };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { const dataToSend = { ...form, data: form.data ? `${form.data}T00:00:00Z` : null }; if (hasValidId(id)) { await apiPut<any>(`/calendario/${id}`, dataToSend); } else { await apiPost<any>("/calendario", dataToSend); } navigate("/dashboard/calendario"); } catch (e) { console.error("Erro ao salvar:", e); } };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">{hasValidId(id) ? "Editar Evento" : "Novo Evento"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block font-semibold mb-1">Título</label><input type="text" name="titulo" value={form.titulo} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">Cidade</label><select name="cidade" value={form.cidade} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required><option value="">Selecione uma cidade</option>{cidades.map((c) => (<option key={c.id} value={c.nome}>{c.nome}</option>))}</select></div>
        <div><label className="block font-semibold mb-1">Data</label><input type="date" name="data" value={form.data} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">Imagem</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.imagem && (<div className="mt-2"><img src={form.imagem} alt="Preview" className="max-w-full h-32 object-cover rounded border" /></div>)}</div>
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition">{hasValidId(id) ? "Salvar alterações" : "Salvar"}</button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "@/utils/api";
import { API_ROUTES } from "@/utils/routes";

function hasValidId(id: any) { if (isNaN(id)) return false; return id && id !== "" && id !== "undefined" && id !== "null"; }

export default function LojasFormPage() {
  const navigate = useNavigate(); const { id } = useParams();
  const [cidades, setCidades] = useState<any[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<any[]>([]);
  const [form, setForm] = useState<{ nome: string; imagem: string; categoria: string; cidade: string; produtos: string[]; whatsapp: string; instagram: string; local: string; }>({ nome: "", categoria: "", imagem: "", cidade: "", produtos: [], whatsapp: "", instagram: "", local: "" });

  useEffect(() => {
    const loadInitialData = async () => {
      try { const r = await apiGet<any>("/cidades?size=1000&page=0"); setCidades(r.data); } catch (e) { console.error(e); }
      try { const r = await apiGet<any>(`${API_ROUTES.CATEGORIAS}?page=1&size=9999`); setCategoriasDisponiveis(r.data || []); } catch (e) { console.error(e); }
      if (hasValidId(id)) { try { const r = await apiGet<any>(`/lojas/${id}`); setForm({ nome: r.nome || "", categoria: r.categoria || "", cidade: r.cidade || "", imagem: r.imagem || "", produtos: r.produtos || [], whatsapp: r.whatsapp || "", instagram: r.instagram || "", local: r.local || "" }); } catch (e) { console.error(e); } }
    };
    loadInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onloadend = () => setForm((prev) => ({ ...prev, imagem: reader.result as string })); reader.readAsDataURL(file); };
  const handleProdutosChange = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); Promise.all(files.map((file) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }))).then((images) => setForm((prev) => ({ ...prev, produtos: images }))).catch(console.error); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (hasValidId(id)) { await apiPut<any>(`/lojas/${id}`, form); } else { await apiPost<any>("/lojas", form); } navigate("/dashboard/lojas"); } catch (err) { console.error(err); } };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">{hasValidId(id) ? "Editar Loja" : "Nova Loja"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block font-semibold mb-1">Nome</label><input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">Categoria</label><select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required><option value="">Selecione uma categoria</option>{categoriasDisponiveis.map((cat) => (<option key={cat.id} value={cat.nome}>{cat.nome}</option>))}</select></div>
        <div><label className="block font-semibold mb-1">Cidade</label><select name="cidade" value={form.cidade} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required><option value="">Selecione uma cidade</option>{cidades.map((c) => (<option key={c.id} value={c.nome}>{c.nome}</option>))}</select></div>
        <div><label className="block font-semibold mb-1">WhatsApp</label><input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
        <div><label className="block font-semibold mb-1">Instagram</label><input type="text" name="instagram" value={form.instagram} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
        <div><label className="block font-semibold mb-1">Local</label><input type="text" name="local" value={form.local} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
        <div><label className="block font-semibold mb-1">Imagem</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.imagem && (<div className="mt-2"><img src={form.imagem} alt="Preview" className="max-w-full h-32 object-cover rounded border" /></div>)}</div>
        <div><label className="block font-semibold mb-1">Produtos (várias imagens)</label><input type="file" multiple accept="image/*" onChange={handleProdutosChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.produtos.length > 0 && (<div className="mt-2 grid grid-cols-3 gap-2">{form.produtos.map((src, idx) => (<img key={idx} src={src} alt={`Produto ${idx + 1}`} className="w-full h-24 object-cover rounded border" />))}</div>)}</div>
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition">{hasValidId(id) ? "Salvar alterações" : "Salvar"}</button>
      </form>
    </div>
  );
}

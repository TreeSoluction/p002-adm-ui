import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "@/utils/api";

function hasValidId(id: any) { if (isNaN(id)) return false; return id && id !== "" && id !== "undefined" && id !== "null"; }
function formatPhone(value: string) { return value.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2").slice(0, 15); }

export default function EstacionamentosFormPage() {
  const navigate = useNavigate(); const { id } = useParams();
  const [form, setForm] = useState<{ nome: string; local: string; cidade: string; imagem: string; whatsapp: string; instagram: string; phone_numbers: string[]; produtos: string[]; }>({ nome: "", local: "", cidade: "", imagem: "", whatsapp: "", instagram: "", phone_numbers: [""], produtos: [] });
  const [cidades, setCidades] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => { if (hasValidId(id)) { const result = await apiGet<any>(`/estacionamentos/${id}`); setForm({ nome: result.nome || "", local: result.local || "", cidade: result.cidade || "", imagem: result.imagem || "", whatsapp: result.whatsapp || "", instagram: result.instagram || "", phone_numbers: result.phone_numbers?.length > 0 ? result.phone_numbers : [""], produtos: result.produtos || [] }); } };
    loadData(); apiGet<any>("/cidades?size=1000&page=0").then((r) => setCidades(r.data)).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setForm({ ...form, imagem: reader.result as string }); reader.readAsDataURL(file); } };
  const handleProdutosChange = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); Promise.all(files.map((file) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }))).then((images) => setForm((prev) => ({ ...prev, produtos: images }))).catch(console.error); };
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "phone_numbers", idx: number) => { const arr = [...form[field]]; arr[idx] = e.target.value; setForm({ ...form, [field]: arr }); };
  const addField = (field: "phone_numbers") => setForm({ ...form, [field]: [...form[field], ""] });
  const removeField = (field: "phone_numbers", idx: number) => { const arr = [...form[field]]; arr.splice(idx, 1); setForm({ ...form, [field]: arr }); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { if (hasValidId(id)) { await apiPut<any>(`/estacionamentos/${id}`, form); } else { await apiPost<any>("/estacionamentos", form); } navigate("/dashboard/estacionamentos"); } catch (e) { console.error(e); } };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-6">{hasValidId(id) ? "Editar Estacionamento" : "Novo Estacionamento"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block font-semibold mb-1">Nome</label><input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">WhatsApp</label><input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
        <div><label className="block font-semibold mb-1">Instagram</label><input type="text" name="instagram" value={form.instagram} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
        <div><label className="block font-semibold mb-1">Cidade</label><select name="cidade" value={form.cidade} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required><option value="">Selecione uma cidade</option>{cidades.map((c) => (<option key={c.id} value={c.nome}>{c.nome}</option>))}</select></div>
        <div><label className="block font-semibold mb-1">Local</label><input type="text" name="local" value={form.local} onChange={handleChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required /></div>
        <div><label className="block font-semibold mb-1">Imagem</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.imagem && (<div className="mt-2"><img src={form.imagem} alt="Preview" className="max-w-full h-32 object-cover rounded border" /></div>)}</div>
        <div><label className="block font-semibold mb-1">Produtos (várias imagens)</label><input type="file" multiple accept="image/*" onChange={handleProdutosChange} className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />{form.produtos.length > 0 && (<div className="mt-2 grid grid-cols-3 gap-2">{form.produtos.map((src, idx) => (<img key={idx} src={src} alt={`Produto ${idx + 1}`} className="w-full h-24 object-cover rounded border" />))}</div>)}</div>
        <div><label className="block font-semibold mb-1">Telefones</label>{form.phone_numbers.map((phone, idx) => (<div key={idx} className="flex items-center mb-2"><input type="text" value={phone} onChange={(e) => handleArrayChange({ ...e, target: { ...e.target, value: formatPhone(e.target.value) } }, "phone_numbers", idx)} className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />{form.phone_numbers.length > 1 && (<button type="button" onClick={() => removeField("phone_numbers", idx)} className="ml-2 text-blue-600 font-bold">Remover</button>)}</div>))}<button type="button" onClick={() => addField("phone_numbers")} className="hover:text-blue-900 mt-1 font-semibold">+ Adicionar telefone</button></div>
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded font-bold text-lg hover:bg-blue-800 transition">{hasValidId(id) ? "Salvar alterações" : "Salvar"}</button>
      </form>
    </div>
  );
}

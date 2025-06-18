import axios, { AxiosError, AxiosRequestConfig } from "axios";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para tratar erros
function handleError(error: any): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.message || error.response.statusText;
    }
    if (error.request) {
      return "Sem resposta do servidor";
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

// Função GET
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// Função POST
export async function apiPost<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await api.post<T>(url, data, config);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// Função PUT
export async function apiPut<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await api.put<T>(url, data, config);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// Função DELETE
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await api.delete<T>(url, config);
    return res.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}
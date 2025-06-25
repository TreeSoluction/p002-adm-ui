"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost } from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext); // pega a função login do contexto
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    try {
      // Supondo que a API retorne { token: "seu_token_jwt" }
      const response = await apiPost<{ access_token: string }>("/users/login", {
        email,
        senha,
      });
      console.log("Login response:", response);
      login(response.access_token); // salva token no contexto e localStorage
      router.push("/"); // redireciona para home ou dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#333",
          fontWeight: "700",
        }}
      >
        Login
      </h1>
      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
            color: "#555",
          }}
        >
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              marginTop: 4,
              marginBottom: "1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 16,
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </label>

        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
            color: "#555",
          }}
        >
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              marginTop: 4,
              marginBottom: "1.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 16,
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </label>

        {error && (
          <p
            style={{
              color: "#d93025",
              marginBottom: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            fontWeight: "700",
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#005bb5")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          Entrar
        </button>
      </form>

      <p
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          color: "#555",
          fontSize: 14,
        }}
      >
        Não tem conta?{" "}
        <Link href="/register" style={{ color: "#0070f3", fontWeight: "600" }}>
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

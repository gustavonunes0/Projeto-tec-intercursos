"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Aqui você implementaria a verificação de autenticação
    // Por enquanto, vamos apenas redirecionar para o login após 5 segundos
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              Bem-vindo ao Dashboard!
            </h1>
            <p className="text-gray-600 text-lg">Login realizado com sucesso</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-lg">
                Redirecionando para a página de login em alguns segundos...
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Esta é uma página de demonstração</p>
            <p className="mt-1">
              Em um ambiente real, você teria acesso a mais funcionalidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

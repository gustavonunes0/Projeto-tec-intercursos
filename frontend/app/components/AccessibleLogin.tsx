"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FaceRecognition from "./FaceRecognition";

export default function AccessibleLogin() {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // Inicializa a síntese de voz
  const speechSynthesis =
    typeof window !== "undefined" ? window.speechSynthesis : null;

  // Função para falar o texto
  const speak = (text: string) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9; // Velocidade mais lenta para melhor compreensão
      speechSynthesis.speak(utterance);
    }
  };

  // Inicia o reconhecimento de voz
  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      recognition.start();
      setIsListening(true);
      speak("Estou ouvindo você. Por favor, diga seu comando.");
    }
  };

  // Manipula os comandos de voz
  const handleVoiceCommand = (command: string) => {
    setIsListening(false);
    if (command.includes("login") || command.includes("entrar")) {
      speak("Iniciando processo de login. Por favor, olhe para a câmera.");
      setShowCamera(true);
      setIsRegistering(false);
    } else if (command.includes("cadastrar") || command.includes("registrar")) {
      speak("Iniciando processo de cadastro. Por favor, olhe para a câmera.");
      setShowCamera(true);
      setIsRegistering(true);
    } else if (command.includes("ajuda")) {
      speak(
        "Você pode dizer: login, cadastrar, ajuda ou sair. Para login ou cadastro, você precisará olhar para a câmera."
      );
    } else if (command.includes("sair")) {
      speak("Até logo!");
      setShowCamera(false);
      setIsRegistering(false);
    } else {
      speak(
        "Desculpe, não entendi. Você pode dizer: login, cadastrar, ajuda ou sair"
      );
    }
  };

  // Manipula a detecção facial
  const handleFaceDetected = async (faceData: any) => {
    try {
      if (isRegistering) {
        // Processo de cadastro
        const response = await fetch(
          "http://localhost:3001/api/register-face",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: "user123", // Em um ambiente real, você teria um sistema de gerenciamento de usuários
              faceData,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          speak("Face cadastrada com sucesso! Agora você pode fazer login.");
          setShowCamera(false);
          setIsRegistering(false);
        } else {
          speak(
            "Não foi possível cadastrar sua face. Por favor, tente novamente."
          );
        }
      } else {
        // Processo de login
        const response = await fetch("http://localhost:3001/api/verify-face", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ faceData }),
        });

        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          speak("Login realizado com sucesso! Bem-vindo!");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          speak(
            "Não foi possível reconhecer seu rosto. Por favor, tente novamente ou faça o cadastro."
          );
        }
      }
    } catch (error) {
      speak("Ocorreu um erro. Por favor, tente novamente.");
    }
  };

  // Manipula erros
  const handleError = (error: string) => {
    setMessage(error);
    speak(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Login Acessível
          </h1>
          <p className="text-gray-600 text-lg">
            Bem-vindo! Use sua voz para navegar
          </p>
        </div>

        {!showCamera ? (
          <div className="space-y-6">
            <button
              onClick={startVoiceRecognition}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transform transition-all duration-200 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                  : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200"
              } focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
              aria-label={isListening ? "Ouvindo..." : "Iniciar Comando de Voz"}
            >
              <div className="flex items-center justify-center space-x-2">
                {isListening ? (
                  <>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span>Ouvindo...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    <span>Iniciar Comando de Voz</span>
                  </>
                )}
              </div>
            </button>

            {message && (
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-800 text-center">{message}</p>
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-blue-800 font-semibold text-lg mb-2">
                Como usar:
              </h2>
              <ul className="text-blue-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Diga "cadastrar" para registrar seu rosto
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Diga "login" para fazer login
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Diga "ajuda" para ouvir as opções
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Diga "sair" para voltar ao menu
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-gray-700 text-center">
                {isRegistering
                  ? "Por favor, olhe para a câmera para cadastrar seu rosto"
                  : "Por favor, olhe para a câmera para fazer login"}
              </p>
            </div>

            <FaceRecognition
              onFaceDetected={handleFaceDetected}
              onError={handleError}
            />

            <button
              onClick={() => {
                setShowCamera(false);
                setIsRegistering(false);
                speak("Voltando para o menu principal");
              }}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-gray-500 hover:bg-gray-600 shadow-lg shadow-gray-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Voltar ao Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

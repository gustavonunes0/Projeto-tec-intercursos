"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface FaceRecognitionProps {
  onFaceDetected: (faceData: any) => void;
  onError: (error: string) => void;
}

export default function FaceRecognition({
  onFaceDetected,
  onError,
}: FaceRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingProgress("Carregando modelo de detecção facial...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setLoadingProgress("Carregando modelo de pontos faciais...");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        setLoadingProgress("Carregando modelo de reconhecimento...");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoading(false);
        console.log("Modelos carregados com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        onError(
          "Erro ao carregar os modelos de reconhecimento facial. Verifique o console para mais detalhes."
        );
      }
    };

    loadModels();
  }, [onError]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Câmera iniciada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      onError(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    }
  };

  const detectFaces = async () => {
    if (!videoRef.current || isModelLoading) return;

    setIsDetecting(true);
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        console.log("Face detectada!");
        onFaceDetected(detections[0]);
      }
    } catch (error) {
      console.error("Erro ao detectar face:", error);
      onError("Erro ao detectar face. Verifique o console para mais detalhes.");
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    if (!isModelLoading) {
      startVideo();
      const interval = setInterval(detectFaces, 1000);
      return () => clearInterval(interval);
    }
  }, [isModelLoading]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-800 font-medium">{loadingProgress}</p>
          </div>
        </div>
      )}

      {isDetecting && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Detectando face...</span>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Posicione seu rosto no centro da tela</p>
        <p className="mt-1">Mantenha uma boa iluminação</p>
      </div>
    </div>
  );
}

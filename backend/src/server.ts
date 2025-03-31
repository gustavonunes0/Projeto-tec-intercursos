import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Simulação de banco de dados de faces
const registeredFaces = new Map();

// Rota para verificação de reconhecimento facial
app.post("/api/verify-face", async (req, res) => {
  try {
    const { faceData } = req.body;

    // Aqui você implementaria a lógica de comparação facial
    // Por enquanto, vamos apenas simular uma verificação bem-sucedida
    // Em um ambiente real, você compararia o faceData com as faces registradas

    // Simula um delay para processamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: "Reconhecimento facial bem-sucedido",
      userId: "user123", // Em um ambiente real, você retornaria o ID do usuário
    });
  } catch (error) {
    console.error("Erro no reconhecimento facial:", error);
    res.status(500).json({
      success: false,
      message: "Erro no reconhecimento facial",
    });
  }
});

// Rota para registro de nova face
app.post("/api/register-face", async (req, res) => {
  try {
    const { userId, faceData } = req.body;

    // Aqui você implementaria a lógica de armazenamento da face
    // Por enquanto, vamos apenas simular o armazenamento

    registeredFaces.set(userId, faceData);

    res.json({
      success: true,
      message: "Face registrada com sucesso",
    });
  } catch (error) {
    console.error("Erro no registro facial:", error);
    res.status(500).json({
      success: false,
      message: "Erro no registro facial",
    });
  }
});

// Rota para autenticação
app.post("/api/auth", async (req, res) => {
  try {
    const { faceId } = req.body;

    // Aqui você implementaria a lógica de autenticação
    // Verificando o faceId contra um banco de dados

    // Simula um delay para processamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: "Autenticação bem-sucedida",
      token: "jwt-token-exemplo", // Em um ambiente real, você geraria um token JWT
    });
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(401).json({
      success: false,
      message: "Autenticação falhou",
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

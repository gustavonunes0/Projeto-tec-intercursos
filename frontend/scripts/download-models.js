const https = require("https");
const fs = require("fs");
const path = require("path");

const models = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
];

const baseUrl =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const modelsDir = path.join(__dirname, "../public/models");

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

models.forEach((model) => {
  const filePath = path.join(modelsDir, model);
  const url = `${baseUrl}/${model}`;

  console.log(`Baixando ${model}...`);

  https
    .get(url, (response) => {
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        console.log(`✓ Baixado: ${model}`);
      });
    })
    .on("error", (err) => {
      console.error(`✗ Erro ao baixar ${model}:`, err.message);
    });
});

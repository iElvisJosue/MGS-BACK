import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, "../public");

const generateFileName = (TituloImagen = "Default", fileName) => {
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return `${TituloImagen}_${code}_${fileName}`;
};

const storage = multer.diskStorage({
  destination: path.join(uploadDir),
  filename: (req, file, cb) => {
    const { TituloImagen } = req.body;
    file.originalname = generateFileName(TituloImagen, file.originalname);
    cb(null, file.originalname);
  },
});

export const multerConfig = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    const fileType = /png|jpg|jpeg/;
    const mimeType = fileType.test(file.mimetype);
    const extType = fileType.test(path.extname(file.originalname));
    if (mimeType && extType) {
      const filePath = path.join(uploadDir, file.originalname);
      fs.exists(filePath, function (exists) {
        if (exists) {
          // Archivo duplicado, rechazar
          req.duplicatedFile = true; // Marcar que el archivo es duplicado
          cb(null, false);
        } else {
          // Archivo nuevo, aceptar
          cb(null, true);
        }
      });
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
}).single("Imagen");

// IMPORTAMOS CONFIGURACIÓN DE VARIABLES DE ENTORNO
import "dotenv/config";
// IMPORTAMOS EXPRESS
import express from "express";
// IMPORTAMOS POLÍTICAS DE CORS
import cors from "cors";
// IMPORTAMOS COOKIE PARSER
import cookieParser from "cookie-parser";
// IMPORTAMOS LAS RUTAS PARA PROCESOS GLOBALES
import globalRoutes from "../routes/global.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE AGENCIAS
import agenciasRoutes from "../routes/agencias.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE CONFIGURACIÓN
import configuracionRoutes from "../routes/configuracion.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE PEDIDOS
import pedidosRoutes from "../routes/pedidos.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE USUARIOS
import usuariosRoutes from "../routes/usuarios.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE PRODUCTOS
import productosRoutes from "../routes/productos.routes.js";

// IMPORTAMOS LA CONFIGURACIÓN DE MULTER
import { multerConfig } from "../middlewares/multer.js";

// CONFIGURAMOS EL PATH
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://www.enviamgs.shop"];

// APLICAMOS CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// DEFINIMOS LA RUTA DE NUESTRAS IMÁGENES
app.set("public", path.join(__dirname, "public"));
// DEFINIMOS LA RUTA PARA SER ACCESIBLE DESDE EL NAVEGADOR
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

// APLICAMOS EL VISUALIZADO DE COOKIES
app.use(cookieParser());

// APLICAMOS MULTER
app.use(multerConfig);

app.use("/api/global", globalRoutes);
app.use("/api/agencias", agenciasRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/configuracion", configuracionRoutes);

export default app;

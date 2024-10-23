// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerTiposDeCarga,
  ObtenerTiposDeEnvio,
} from "../controllers/configuracion.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ObtenerTiposDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ObtenerTiposDeEnvio);

// EXPORTAMOS EL ENRUTADOR
export default router;

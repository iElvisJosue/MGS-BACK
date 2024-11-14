// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerTiposDeCarga,
  ObtenerTiposDeEnvio,
  ObtenerApiGoogleMapsAutoCompletado,
} from "../controllers/configuracion.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ObtenerTiposDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ObtenerTiposDeEnvio);
// RUTA PARA OBTENER LA API DE GOOGLE MAPS AUTO COMPLETADO
router.get(
  "/ObtenerApiGoogleMapsAutoCompletado/:CookieConToken",
  ObtenerApiGoogleMapsAutoCompletado
);

// EXPORTAMOS EL ENRUTADOR
export default router;

// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import { ValidarTokenParaPeticion } from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE CARGA
// SE UTILIZA EN LAS VISTAS: Paquetería > Realizar pedido > Detalles del pedido
export const ObtenerTiposDeCarga = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposcarga`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE ENVIO
// SE UTILIZA EN LAS VISTAS: Paquetería > Realizar pedido > Detalles del pedido
export const ObtenerTiposDeEnvio = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposenvio`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

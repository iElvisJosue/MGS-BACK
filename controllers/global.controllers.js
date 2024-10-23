import jwt from "jsonwebtoken";
// IMPORTAMOS EL TOKEN CREADO
import { CrearTokenDeAcceso } from "../libs/jwt.js";
import { TOKEN_SECRETO } from "../initial/config.js";
// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import { MENSAJE_DE_ERROR } from "../helpers/Const.js";

export const IniciarSesion = (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND Contraseña = ? AND EstadoUsuario = 'Activo'`;
    CONEXION.query(sql, [Usuario, Contraseña], async (error, result) => {
      if (result.length > 0) {
        // CREAMOS EL ID EN UN TOKEN
        const TokenDeAcceso = await CrearTokenDeAcceso({
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
        });
        // ALMACENAMOS EL TOKEN EN UN COOKIE
        // res.cookie("TokenDeAcceso", TokenDeAcceso);
        res.cookie("TokenDeAcceso", TokenDeAcceso, {
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });
        const InformacionDelUsuario = {
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
          TokenDeAcceso,
        };
        // ENVIAMOS EL TOKEN AL CLIENTE
        res.status(200).json(InformacionDelUsuario);
      } else {
        res
          .status(404)
          .json(
            "Lo sentimos, las credenciales proporcionadas no son correctas. Por favor, verifica tu nombre de usuario y contraseña e inténtalo de nuevo."
          );
      }
    });
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
export const VerificarToken = async (req, res) => {
  const { cookie } = req.body;

  jwt.verify(cookie, TOKEN_SECRETO, async (err, InformacionDelToken) => {
    if (err) {
      console.log("HUBO UN ERROR Y ES:", err);
      return res.status(400).json(["TU TOKEN NO ESTA AUTORIZADO"]);
    }
    return res.json(InformacionDelToken);
  });
};
export const CerrarSesion = async (req, res) => {
  try {
    res.cookie("TokenDeAcceso", "", {
      expires: new Date(0),
    });
    res.send("SESIÓN FINALIZADA");
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

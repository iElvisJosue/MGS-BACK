// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import {
  ObtenerHoraActual,
  ValidarTokenParaPeticion,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Registrar Usuario
export const RegistrarUsuario = async (req, res) => {
  const { Usuario, Permisos, Contraseña, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM usuarios WHERE Usuario = ?`;
    CONEXION.query(sql, [Usuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el usuario ${Usuario.toUpperCase()} ya existe, por favor intente con otro nombre de usuario. `
          );
      } else {
        const sql = `INSERT INTO usuarios (Usuario, Contraseña, Permisos, FechaCreacionUsuario, HoraCreacionUsuario) VALUES (?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [Usuario, Contraseña, Permisos],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `¡El usuario ${Usuario.toUpperCase()} ha sido registrado correctamente!`
              );
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS USUARIOS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios
export const BuscarUsuariosParaAdministrarPorFiltro = async (req, res) => {
  const { CookieConToken, filtro, idUsuario } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramBUPAPF = [idUsuario];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM usuarios WHERE idUsuario != ? ORDER BY idUsuario ASC`;
    } else {
      paramBUPAPF.push(`%${filtro}%`);
      sql = `SELECT * FROM usuarios WHERE idUsuario != ? AND Usuario LIKE ? ORDER BY idUsuario ASC`;
    }
    CONEXION.query(sql, paramBUPAPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DEL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios
export const ActualizarEstadoUsuario = async (req, res) => {
  const { idUsuario, EstadoUsuario, CookieConToken } = req.body;

  const TEXTO_ESTADO = EstadoUsuario === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE usuarios SET EstadoUsuario = ? WHERE idUsuario = ?`;
    CONEXION.query(sql, [EstadoUsuario, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡El usuario ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR INFORMACION DE UN USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Editar Usuario
export const ActualizarInformacionDeUnUsuario = async (req, res) => {
  const { idUsuario, Usuario, Permisos, Contraseña, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND idUsuario != ?`;
    CONEXION.query(sql, [Usuario, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el usuario ${Usuario.toUpperCase()} ya existe, por favor intente con otro nombre de usuario.`
          );
      } else {
        const sql = `UPDATE usuarios SET Usuario = ?, Permisos = ?, Contraseña = ? WHERE idUsuario = ?`;
        CONEXION.query(
          sql,
          [Usuario, Permisos, Contraseña, idUsuario],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `El usuario ${Usuario.toUpperCase()} ha sido actualizado correctamente ✨`
              );
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const BuscarAgenciasQueTieneElUsuario = async (req, res) => {
  const { CookieConToken, idUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ? AND a.StatusAgencia = ? ORDER BY a.idAgencia ASC`;
    CONEXION.query(sql, [idUsuario, "Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const BuscarAgenciasQueNoTieneElUsuario = async (req, res) => {
  const { CookieConToken, filtro, idUsuario } = req.body;

  // INICIALIZAMOS PARAMETROS
  let paramBAQNTEU = ["Activa", idUsuario];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * 
          FROM agencias 
          WHERE StatusAgencia = ? AND idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ?) 
          ORDER BY idAgencia ASC`;
    } else {
      paramBAQNTEU.unshift(`%${filtro}%`);
      sql = `SELECT * 
          FROM agencias 
          WHERE NombreAgencia LIKE ?  
          AND StatusAgencia = ?
          AND idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ?) 
          ORDER BY idAgencia ASC`;
    }
    CONEXION.query(sql, paramBAQNTEU, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const AsignarAgenciaAlUsuario = async (req, res) => {
  const { CookieConToken, idUsuario, idAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `INSERT INTO union_usuarios_agencias (idUsuario, idAgencia) VALUES (?,?)`;
    CONEXION.query(sql, [idUsuario, idAgencia], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡La agencia ha sido asignada con éxito al usuario!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const DesasignarAgenciaAlUsuario = async (req, res) => {
  const { CookieConToken, idUnionAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM union_usuarios_agencias WHERE idUnionUsuariosAgencias  = ?`;
    CONEXION.query(sql, [idUnionAgencia], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡La agencia ha sido desasignada con éxito al usuario!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

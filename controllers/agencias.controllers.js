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

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UNA NUEVA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Registrar Agencia
export const RegistrarAgencia = async (req, res) => {
  const {
    Agencia,
    Contacto,
    Telefono,
    Correo,
    PaisAgencia,
    CodigoPaisAgencia,
    Estado,
    Ciudad,
    CP,
    Direccion,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM agencias WHERE NombreAgencia = ?`;
    CONEXION.query(sql, [Agencia], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(500)
          .json(
            `La agencia ${Agencia.toUpperCase()} ya existe, por favor intente con otro nombre de agencia ❌`
          );
      } else {
        const sql = `INSERT INTO agencias (NombreAgencia, NombreContactoAgencia, TelefonoContactoAgencia, CorreoContactoAgencia, PaisAgencia, CodigoPaisAgencia, EstadoAgencia, CiudadAgencia, CodigoPostalAgencia, DireccionAgencia, FechaCreacionAgencia, HoraCreacionAgencia) VALUES (?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [
            Agencia || "",
            Contacto || "",
            Telefono || "",
            Correo || "",
            PaisAgencia || "",
            CodigoPaisAgencia || "",
            Estado || "",
            Ciudad || "",
            CP || "",
            Direccion || "",
          ],
          (error, result) => {
            if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `La agencia ${Agencia.toUpperCase()} ha sido registrada correctamente ✨`
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
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias
export const BuscarAgenciasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM agencias ORDER BY idAgencia ASC`
        : `SELECT * FROM agencias WHERE NombreAgencia LIKE ? ORDER BY idAgencia ASC`;
    CONEXION.query(sql, [`%${filtro}%`], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias
export const ActualizarEstadoAgencia = async (req, res) => {
  const { idAgencia, StatusAgencia, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE agencias SET StatusAgencia = ? WHERE idAgencia = ?`;
    CONEXION.query(sql, [StatusAgencia, idAgencia], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json(`Agencia ${StatusAgencia.toUpperCase()} con éxito ✨`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR LA INFORMACIÓN DE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias > Editar Agencia
export const ActualizarInformacionAgencia = async (req, res) => {
  const {
    CookieConToken,
    idAgencia,
    Agencia,
    Contacto,
    Telefono,
    Correo,
    PaisAgencia,
    CodigoPaisAgencia,
    Estado,
    Ciudad,
    CP,
    Direccion,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM agencias WHERE NombreAgencia = ? AND idAgencia != ?`;
    CONEXION.query(sql, [Agencia, idAgencia], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        return res
          .status(500)
          .json(
            `La agencia ${Agencia.toUpperCase()} ya existe, por favor intente con otro nombre de agencia ❌`
          );
      } else {
        const sql = `UPDATE agencias SET NombreAgencia = ?, NombreContactoAgencia = ?, TelefonoContactoAgencia = ?, CorreoContactoAgencia = ?, PaisAgencia = ?, CodigoPaisAgencia = ?, EstadoAgencia = ?, CiudadAgencia = ?, CodigoPostalAgencia = ?, DireccionAgencia = ? WHERE idAgencia = ?`;
        CONEXION.query(
          sql,
          [
            Agencia || "",
            Contacto || "",
            Telefono || "",
            Correo || "",
            PaisAgencia || "",
            CodigoPaisAgencia || "",
            Estado || "",
            Ciudad || "",
            CP || "",
            Direccion || "",
            idAgencia,
          ],
          (error, result) => {
            if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `La agencia ${Agencia.toUpperCase()} ha sido actualizada con éxito ✨`
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
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS QUE TIENE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias > Administrar Productos
export const BuscarProductosQueTieneLaAgencia = async (req, res) => {
  const { CookieConToken, idAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT 
    p.NombreProducto,
    p.AnchoProducto,
    p.AltoProducto,
    p.LargoProducto,
    uap.idUnionAgenciasProductos,
    uap.PrecioProducto,
    uap.ComisionProducto,
    uap.LibraExtraProducto,
    uap.PesoSinCobroProducto,
    uap.PesoMaximoProducto
    FROM union_agencias_productos uap 
    LEFT JOIN productos p ON uap.idProducto = p.idProducto 
    WHERE uap.idAgencia = ? AND p.StatusProducto = ?`;
    CONEXION.query(sql, [idAgencia, "Activo"], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS QUE NO TIENE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias > Administrar Productos
export const BuscarProductosQueNoTieneLaAgencia = async (req, res) => {
  const { CookieConToken, filtro, idAgencia } = req.body;

  // INICIA CON EL ID AGENCIA PORQUE ESE SÍ O SÍ VENDRÁ EN LA PETICIÓN
  let paramsBPQNTLA = [idAgencia, "Activo"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM productos WHERE idProducto NOT IN (SELECT idProducto FROM union_agencias_productos WHERE idAgencia = ?) AND StatusProducto = ?`;
    } else {
      paramsBPQNTLA.unshift(`%${filtro}%`);
      sql = `SELECT * FROM productos WHERE NombreProducto LIKE ? AND idProducto NOT IN (SELECT idProducto FROM union_agencias_productos WHERE idAgencia = ?) AND StatusProducto = ?`;
    }
    CONEXION.query(sql, paramsBPQNTLA, (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UN PRODUCTO A UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias > Administrar Productos > Asignar Productos
export const AsignarProductoAgencia = async (req, res) => {
  const {
    CookieConToken,
    idAgencia,
    idProducto,
    PrecioProducto,
    ComisionProducto,
    LibraExtraProducto,
    PesoMaximoProducto,
    PesoSinCobroProducto,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `INSERT INTO union_agencias_productos (idAgencia, idProducto, PrecioProducto, ComisionProducto, LibraExtraProducto, PesoMaximoProducto, PesoSinCobroProducto) VALUES (?,?,?,?,?,?,?)`;
    CONEXION.query(
      sql,
      [
        idAgencia,
        idProducto,
        PrecioProducto,
        ComisionProducto,
        LibraExtraProducto,
        PesoMaximoProducto,
        PesoSinCobroProducto,
      ],
      (error, result) => {
        if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json("El producto ha sido asignada con éxito ✨");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UN PRODUCTO A UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias > Administrar Productos > Desasignar Productos
export const DesasignarProductoAgencia = async (req, res) => {
  const { CookieConToken, idUnionAgenciasProductos } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM union_agencias_productos WHERE idUnionAgenciasProductos = ?`;
    CONEXION.query(sql, [idUnionAgenciasProductos], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json("El producto ha sido desasignado con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Nuevo envío > Seleccionar Agencia
export const BuscarAgenciasPorFiltroYTipoDeUsuario = async (req, res) => {
  const { CookieConToken, filtro, tipoDeUsuario, idDelUsuario } = req.body;

  // INICIALIZAMOS EL ARRAY DE PARAMETROS
  let paramsBAPFYTU = ["Activa"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    let sql;

    if (tipoDeUsuario === "Administrador") {
      if (filtro === "") {
        sql = `SELECT * FROM agencias WHERE StatusAgencia = ? ORDER BY idAgencia ASC`;
      } else {
        paramsBAPFYTU.unshift(`%${filtro}%`);
        sql = `SELECT * FROM agencias WHERE NombreAgencia LIKE ? AND StatusAgencia = ? ORDER BY idAgencia ASC`;
      }
      CONEXION.query(sql, paramsBAPFYTU, (error, result) => {
        if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.send(result);
      });
    } else {
      const sql = `SELECT * FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ? AND a.StatusAgencia = ? ORDER BY a.idAgencia ASC`;
      CONEXION.query(sql, [idDelUsuario, "Activa"], (error, result) => {
        if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.send(result);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LA AGENCIA MGS
// SE UTILIZA EN LAS VISTAS: Paquetería > Realizar orden
export const ObtenerAgenciaMGS = async (req, res) => {
  const { CookieConToken } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    const sql = `SELECT * FROM agencias WHERE NombreAgencia = ?`;
    CONEXION.query(sql, ["Envía MGS"], (error, result) => {
      if (error) return res.status(500).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

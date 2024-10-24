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

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Registrar Productos
export const RegistrarProducto = async (req, res) => {
  const {
    NombreProducto,
    AnchoProducto,
    LargoProducto,
    AltoProducto,
    CostoCajaVaciaProducto,
    SeVendeProducto,
    PrecioProducto,
    CostoLibraExtraProducto,
    PesoSinCobroProducto,
    PesoMaximoProducto,
    ComisionProducto,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM productos WHERE NombreProducto = ?`;
    CONEXION.query(sql, [NombreProducto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el producto ${NombreProducto.toUpperCase()} ya existe, por favor intente con otro nombre de producto.`
          );
      } else {
        const sql = `INSERT INTO productos (NombreProducto, AnchoProducto, LargoProducto, AltoProducto, CostoCajaVaciaProducto, SeVendeProducto,  PrecioProducto, LibraExtraProducto, PesoSinCobroProducto, PesoMaximoProducto, ComisionProducto, FechaCreacionProducto, HoraCreacionProducto) VALUES (?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [
            NombreProducto || "",
            AnchoProducto || "",
            LargoProducto || "",
            AltoProducto || "",
            CostoCajaVaciaProducto || 0,
            SeVendeProducto || "Si",
            PrecioProducto || "",
            CostoLibraExtraProducto || "",
            PesoSinCobroProducto || "",
            PesoMaximoProducto || "",
            ComisionProducto || "",
          ],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `¡El producto ${NombreProducto.toUpperCase()} ha sido registrado correctamente!`
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
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos
export const BuscarProductosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM productos ORDER BY idProducto DESC`
        : `SELECT * FROM productos WHERE NombreProducto LIKE ? ORDER BY NombreProducto DESC`;
    CONEXION.query(sql, [`%${filtro}%`], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UN PRODUCTO
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos
export const ActualizarEstadoProducto = async (req, res) => {
  const { idProducto, StatusProducto, CookieConToken } = req.body;

  const TEXTO_ESTADO = StatusProducto === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE productos SET StatusProducto = ? WHERE idProducto = ?`;
    CONEXION.query(sql, [StatusProducto, idProducto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡El producto ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR LA INFORMACION DE UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos > Editar Producto
export const ActualizarInformacionDeUnProducto = async (req, res) => {
  const {
    CookieConToken,
    idProducto,
    NombreProducto,
    AnchoProducto,
    LargoProducto,
    AltoProducto,
    CostoCajaVaciaProducto,
    PrecioProducto,
    CostoLibraExtraProducto,
    PesoSinCobroProducto,
    PesoMaximoProducto,
    ComisionProducto,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sqlValidar = `SELECT * FROM productos WHERE NombreProducto = ? AND idProducto != ?`;
    CONEXION.query(
      sqlValidar,
      [NombreProducto, idProducto],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que el producto ${NombreProducto.toUpperCase()} ya existe, por favor intente con otro nombre de producto.`
            );
        } else {
          const sql = `UPDATE productos SET NombreProducto = ?, AnchoProducto = ?, LargoProducto = ?, AltoProducto = ?, CostoCajaVaciaProducto = ?, PrecioProducto = ?, LibraExtraProducto = ?, PesoSinCobroProducto = ?, PesoMaximoProducto = ?, ComisionProducto = ? WHERE idProducto = ?`;
          CONEXION.query(
            sql,
            [
              NombreProducto || "",
              AnchoProducto || "",
              LargoProducto || "",
              AltoProducto || "",
              CostoCajaVaciaProducto || "",
              PrecioProducto || "",
              CostoLibraExtraProducto || "",
              PesoSinCobroProducto || "",
              PesoMaximoProducto || "",
              ComisionProducto || "",
              idProducto,
            ],
            (error, result) => {
              if (error)
                return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
              res
                .status(200)
                .json("¡El producto ha sido actualizado con éxito!");
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PRODUCTOS DE LA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Realizar Pedido > Detalles del pedido > Seleccionar producto
export const ObtenerProductosPorAgencia = async (req, res) => {
  const { idAgencia, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT 
      p.NombreProducto,
      p.AnchoProducto,
      p.LargoProducto,
      p.AltoProducto,
      p.idProducto,
      uap.PrecioProducto,
      uap.ComisionProducto,
      uap.LibraExtraProducto,
      uap.PesoSinCobroProducto,
      uap.PesoMaximoProducto
      FROM union_agencias_productos uap
      LEFT JOIN productos p ON uap.idProducto = p.idProducto
      WHERE uap.idAgencia = ? AND p.StatusProducto = ?`;
    CONEXION.query(sql, [idAgencia, "Activo"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE TIENE EN UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos > Administrar Agencias
export const BuscarAgenciasQueTieneUnProducto = async (req, res) => {
  const { CookieConToken, idProducto } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM union_agencias_productos uap LEFT JOIN agencias a ON uap.idAgencia = a.idAgencia WHERE uap.idProducto = ? AND a.StatusAgencia = ? ORDER BY a.idAgencia DESC`;
    CONEXION.query(sql, [idProducto, "Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE NO TIENE UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos > Administrar Agencias
export const BuscarAgenciasQueNoTieneUnProducto = async (req, res) => {
  const { CookieConToken, filtro, idProducto } = req.body;

  // INICIALIZAR PARAMETROS
  let paramBAQNTUP = ["Activa", idProducto];

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
          WHERE StatusAgencia = ? AND idAgencia NOT IN (SELECT idAgencia FROM union_agencias_productos WHERE idProducto = ?)
          ORDER BY idAgencia DESC`;
    } else {
      paramBAQNTUP.unshift(`%${filtro}%`);
      sql = `SELECT *
          FROM agencias
          WHERE NombreAgencia LIKE ?
          AND StatusAgencia = ?
          AND idAgencia NOT IN (SELECT idAgencia FROM union_agencias_productos WHERE idProducto = ?)
          ORDER BY idAgencia DESC`;
    }
    CONEXION.query(sql, paramBAQNTUP, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UNA AGENCIA A UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos > Administrar Agencias
export const AsignarAgenciaAlProducto = async (req, res) => {
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
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res
          .status(200)
          .json("¡La agencia ha sido asignada con éxito al producto!");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UNA AGENCIA A UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos > Administrar Agencias
export const DesasignarAgenciaAlProducto = async (req, res) => {
  const { CookieConToken, idUnionAgenciasProductos } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM union_agencias_productos WHERE idUnionAgenciasProductos = ?`;
    CONEXION.query(sql, [idUnionAgenciasProductos], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡La agencia ha sido desasignada con éxito del producto!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR SI EL PRODUCTO SE VENDE O NO
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos
export const ActualizarSeVendeProducto = async (req, res) => {
  const { CookieConToken, SeVendeProducto, idProducto } = req.body;

  const MENSAJE_RESPUESTA =
    SeVendeProducto === "Si"
      ? "¡El producto seleccionado ya esta disponible para su venta!"
      : "¡El producto seleccionado ya no esta disponible para su venta!";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE productos SET SeVendeProducto = ? WHERE idProducto = ?`;
    CONEXION.query(sql, [SeVendeProducto, idProducto], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(MENSAJE_RESPUESTA);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS OBTENER LOS PRODUCTOS ACTIVOS Y DISPONIBLES PARA VENDER
// SE UTILIZA EN LAS VISTAS: Paquetería > Realizar Orden > Caja
export const ObtenerProductosActivosYDisponiblesParaVender = async (
  req,
  res
) => {
  const { CookieConToken } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM productos WHERE StatusProducto = ? AND SeVendeProducto = ?`;
    CONEXION.query(sql, ["Activo", "Si"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

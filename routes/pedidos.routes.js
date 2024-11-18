// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  GuardarTodaLaInformacion,
  BuscarPedidosPorFiltro,
  BuscarPedidosPorPaquete,
  BuscarRemitentesPorAgencia,
  BuscarDestinatariosPorAgencia,
  BuscarUltimosDiezPedidos,
  BuscarMovimientosDeUnPedido,
  BuscarPedidoPorNumeroDeGuia,
  BuscarPedidosPorFecha,
  GuardarInformacionDeLaOrden,
  BuscarOrdenesPorFiltro,
  BuscarOrdenesPorFecha,
  BuscarMovimientosDeUnaOrden,
  BuscarOrdenesPorPaquete,
  CompletarInformacionDeUnaOrden,
} from "../controllers/pedidos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA GUARDAR LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
router.post("/GuardarTodaLaInformacion", GuardarTodaLaInformacion);
// RUTA PARA BUSCAR TODOS LOS PEDIDOS POR FILTRO
router.post("/BuscarPedidosPorFiltro", BuscarPedidosPorFiltro);
// RUTA PARA BUSCAR LOS PEDIDOS POR PAQUETE
router.post("/BuscarPedidosPorPaquete", BuscarPedidosPorPaquete);
// RUTA PARA BUSCAR LOS REMITENTES POR AGENCIA
router.post("/BuscarRemitentesPorAgencia", BuscarRemitentesPorAgencia);
// RUTA PARA BUSCAR LOS DESTINATARIOS POR AGENCIA
router.post("/BuscarDestinatariosPorAgencia", BuscarDestinatariosPorAgencia);
// RUTA PARA BUSCAR LOS DESTINATARIOS POR AGENCIA
router.get("/BuscarUltimosDiezPedidos", BuscarUltimosDiezPedidos);
// RUTA PARA BUSCAR LOS MOVIMIENTOS DE UN PEDIDO
router.post("/BuscarMovimientosDeUnPedido", BuscarMovimientosDeUnPedido);
// RUTA PARA BUSCAR BUSCAR UN PEDIDO POR NUMERO DE GUIA
router.get(
  "/BuscarPedidoPorNumeroDeGuia/:GuiaPedido",
  BuscarPedidoPorNumeroDeGuia
);
// RUTA PARA BUSCAR PEDIDOS POR FECHA
router.post("/BuscarPedidosPorFecha", BuscarPedidosPorFecha);
// RUTA PARA GUARDAR LA INFORMACION DE LA ORDEN
router.post("/GuardarInformacionDeLaOrden", GuardarInformacionDeLaOrden);
// RUTA PARA BUSCAR TODAS LAS ORDENES POR FILTRO
router.post("/BuscarOrdenesPorFiltro", BuscarOrdenesPorFiltro);
// RUTA PARA BUSCAR ORDENES POR FECHA
router.post("/BuscarOrdenesPorFecha", BuscarOrdenesPorFecha);
// RUTA PARA BUSCAR LOS MOVIMIENTOS DE UNA
router.post("/BuscarMovimientosDeUnaOrden", BuscarMovimientosDeUnaOrden);
// RUTA PARA BUSCAR LAS ORDENES POR PAQUETE
router.post("/BuscarOrdenesPorPaquete", BuscarOrdenesPorPaquete);
// RUTA PARA COMPLETAR LA INFORMACION DE UNA ORDEN
router.put("/CompletarInformacionDeUnaOrden", CompletarInformacionDeUnaOrden);

// EXPORTAMOS EL ENRUTADOR
export default router;

// LIBRERÍAS PARA EL PDF
import bwipjs from "bwip-js";
import fs from "fs";
import createPdf from "pdfmake";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

// RUTAS PARA EL PDF
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FuenteURL = path.join(__dirname, "../public/Fuentes");
const PdfURL = path.join(__dirname, "../public/PDF");
const imgURL = path.join(__dirname, "../public");

// DEFINIMOS PARÁMETROS DEL TICKET
const TamañoTextoTitulo = 16;
const TamañoTextoNormal = 13;
const TamañoTextoPequeño = 10;
const TamañoTextoMuyPequeño = 6;
const TamañoDelTicket = 80 * 2.83465;
// const TamañoDeLaEtiqueta = 102 * 2.83465;
const TamañoDeLaLinea = 80 * 2.54965;

// IMPORTAMOS LAS AYUDAS
import { LINK_QR } from "./Const.js";

export const CrearTicketDelPedido = (
  NombreDelTicket,
  remitente,
  destinatario,
  infoPedido,
  GuiaPedido
) => {
  const LinkDelQR = `${LINK_QR}${GuiaPedido}`;

  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Formato de 24 horas
  };
  const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);
  // ASIGNAMOS LA FUENTE AL PDF
  const Fuente = {
    Roboto: {
      normal: path.join(FuenteURL, "Ticketing.ttf"),
    },
  };
  var ImpresorDelPDF = new createPdf(Fuente);
  // DEFINIMOS EL TAMAÑO DE LA PAGINA
  const TamañoDePagina = {
    width: TamañoDelTicket,
    height: "auto", // Altura automática
  };
  // IMAGEN DEL LOGO
  const ImagenDelPDF = path.join(imgURL, "ImagenTicketPedido.png");
  // DEFINIMOS EL DOCUMENTO PDF
  const CuerpoDelPDF = {
    pageSize: TamañoDePagina,
    content: [
      {
        image: ImagenDelPDF,
        width: 50,
        height: 50,
        alignment: "center",
        marginBottom: 2.5,
      },
      {
        text: "Envía MGS",
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },

      {
        text: "Ciudad, Estado",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: "Dirección del local",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: `Fecha y hora ${FechaConHora}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: "Número de guía",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: GuiaPedido,
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: "REMITENTE",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${remitente.NombreRemitente} ${remitente.ApellidosRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "DESTINATARIO",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${destinatario.NombreDestinatario} ${destinatario.ApellidoPaternoDestinatario} ${destinatario.ApellidoMaternoDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      destinatario.CelularDestinatario || destinatario.TelefonoCasaDestinatario
        ? {
            text: `Telefono(s): ${destinatario.CelularDestinatario}${
              destinatario.TelefonoCasaDestinatario &&
              ` - ${destinatario.TelefonoCasaDestinatario}`
            }`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          }
        : {
            text: `Teléfono(s): N/A`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
      {
        text: `${
          destinatario.MunicipioDelegacionDestinatario &&
          `${destinatario.MunicipioDelegacionDestinatario}, `
        }${destinatario.DireccionDestinatario}, CP. ${
          destinatario.CodigoPostalDestinatario
        }`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `${destinatario.PaisDestinatario} / ${destinatario.EstadoDestinatario} / ${destinatario.CiudadDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      destinatario.ReferenciaDestinatario && {
        text: `Ref. ${destinatario.ReferenciaDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: infoPedido.Producto,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Ancho: ${infoPedido.Ancho} - Largo: ${infoPedido.Largo} - Alto: ${infoPedido.Alto}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Peso: ${infoPedido.Peso} lb(s)`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Costo envío ${infoPedido.CostoEnvio.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })} | TCF: $0.00 | Costo seguro ${infoPedido.CostoSeguro.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )} | Costo sobre peso ${infoPedido.CostoSobrePeso.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `TOTAL: ${infoPedido.Total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}`,
        alignment: "center",
        fontSize: TamañoTextoNormal,
        margin: [0, 5, 0, 2.5],
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      { qr: LinkDelQR, fit: 90, alignment: "center", margin: [0, 10] },
      // {
      //   text: HOST,
      //   alignment: "center",
      //   fontSize: TamañoTextoPequeño,
      // },
      {
        text: "PARA CONOCER EL ESTATUS DE TU PAQUETE, ESCANEA EL CÓDIGO QR DE ARRIBA.",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: "Agencia:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginTop: 7.5,
      },
      {
        text: infoPedido.NombreAgencia.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "Usuario:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: infoPedido.UsuarioResponsable.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
    ],
    defaultStyle: {
      font: "Roboto", // Establece la fuente predeterminada para todo el documento
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    pageMargins: [10, 10, 10, 10],
  };
  // CREAMOS EL DOCUMENTO PDF
  const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);
  // Generar el PDF y guardarlo en un archivo
  const RutaDelPDF = path.join(PdfURL, NombreDelTicket);
  // Guarda el documento PDF en un archivo
  pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
  pdfDoc.end();
};
export const CrearEtiquetaDelPedido = (
  NombreDeLaEtiqueta,
  remitente,
  destinatario,
  infoPedido,
  GuiaPedido
) => {
  const LinkDelQR = GuiaPedido;

  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Formato de 24 horas
  };
  const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);
  // ASIGNAMOS LA FUENTE AL PDF
  const Fuente = {
    Roboto: {
      normal: path.join(FuenteURL, "Roboto-Regular.ttf"),
    },
  };
  bwipjs.toBuffer(
    {
      bcid: "code128", // Tipo de código de barras (Code 128)
      text: GuiaPedido, // Texto del código de barras
      scale: 0, // Reduce el grosor de las barras (más delgado)
      height: 5, // Aumenta la altura de las barras
    },
    function (err, png) {
      if (err) {
        console.log(err);
      } else {
        var ImpresorDelPDF = new createPdf(Fuente);
        // DEFINIMOS EL DOCUMENTO PDF
        const CuerpoDelPDF = {
          // DEFINIMOS EL TAMAÑO DE LA PAGINA
          pageSize: "LETTER",
          content: [
            {
              columns: [
                { width: "*", text: "" },
                {
                  width: "auto",
                  table: {
                    headerRows: 1,
                    widths: [200, 200],
                    body: [
                      [
                        {
                          colSpan: 2,
                          marginTop: 2.5,
                          qr: LinkDelQR,
                          fit: 80,
                          alignment: "center",
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: "Envía MGS",
                          alignment: "center",
                          fontSize: TamañoTextoNormal,
                          margin: [0, 2.5],
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: GuiaPedido,
                          alignment: "center",
                          color: "white",
                          fillColor: "black",
                          fontSize: TamañoTextoTitulo,
                        },
                        {},
                      ],
                      [
                        {
                          text: "REMITENTE",
                          alignment: "center",
                          fontSize: TamañoTextoPequeño,
                          marginTop: 2.5,
                        },
                        {
                          text: "DESTINATARIO",
                          alignment: "center",
                          fontSize: TamañoTextoPequeño,
                          marginTop: 2.5,
                        },
                      ],
                      [
                        {
                          text: `${remitente.NombreRemitente.toUpperCase()} ${remitente.ApellidosRemitente.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${destinatario.NombreDestinatario.toUpperCase()} ${destinatario.ApellidoPaternoDestinatario.toUpperCase()} ${destinatario.ApellidoMaternoDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          text: `${remitente.DireccionRemitente.toUpperCase()}, CP. ${
                            remitente.CodigoPostalRemitente
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${destinatario.DireccionDestinatario.toUpperCase()}, CP. ${destinatario.CodigoPostalDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          text: `${remitente.PaisRemitente.toUpperCase()} / ${remitente.CiudadRemitente.toUpperCase()} / ${remitente.EstadoRemitente.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${
                            destinatario.MunicipioDelegacionDestinatario.toUpperCase()
                              ? destinatario.MunicipioDelegacionDestinatario.toUpperCase() +
                                " / "
                              : ""
                          }${destinatario.PaisDestinatario.toUpperCase()} / ${destinatario.CiudadDestinatario.toUpperCase()} / ${destinatario.EstadoDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          marginBottom: 2.5,
                          text: `${
                            remitente.ReferenciaRemitente &&
                            `REF. ${remitente.ReferenciaRemitente.toUpperCase()}`
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          marginBottom: 2.5,
                          text: `${
                            destinatario.ReferenciaDestinatario &&
                            `REF. ${destinatario.ReferenciaDestinatario.toUpperCase()}`
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          colSpan: 2,
                          text: `${infoPedido.Peso} lb(s)`,
                          alignment: "center",
                          fontSize: TamañoTextoNormal,
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: `Fecha documentación: ${FechaConHora}`,
                          alignment: "center",
                          color: "white",
                          fillColor: "black",
                          fontSize: TamañoTextoPequeño,
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          image:
                            "data:image/png;base64," + png.toString("base64"),
                          marginTop: 2.5,
                          width: 400,
                        },
                        {},
                      ],
                    ],
                  },
                  // Layout personalizado para los bordes solo en los extremos
                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 0 || i === node.table.body.length ? 1 : 0; // Líneas horizontales solo arriba y abajo
                    },
                    vLineWidth: function (i, node) {
                      return i === 0 || i === node.table.widths.length ? 1 : 0; // Líneas verticales solo en los costados
                    },
                    hLineColor: function (i, node) {
                      return "black"; // Color de las líneas horizontales
                    },
                    vLineColor: function (i, node) {
                      return "black"; // Color de las líneas verticales
                    },
                  },
                },
                { width: "*", text: "" },
              ],
            },
            {
              columns: [
                { width: "*", text: "" },
                {
                  width: "auto",
                  table: {
                    headerRows: 1,
                    widths: [200, 200],
                    body: [
                      [
                        {
                          colSpan: 2,
                          marginTop: 2.5,
                          qr: LinkDelQR,
                          fit: 80,
                          alignment: "center",
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: "Envía MGS",
                          alignment: "center",
                          fontSize: TamañoTextoNormal,
                          margin: [0, 2.5],
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: GuiaPedido,
                          alignment: "center",
                          color: "white",
                          fillColor: "black",
                          fontSize: TamañoTextoTitulo,
                        },
                        {},
                      ],
                      [
                        {
                          text: "REMITENTE",
                          alignment: "center",
                          fontSize: TamañoTextoPequeño,
                          marginTop: 2.5,
                        },
                        {
                          text: "DESTINATARIO",
                          alignment: "center",
                          fontSize: TamañoTextoPequeño,
                          marginTop: 2.5,
                        },
                      ],
                      [
                        {
                          text: `${remitente.NombreRemitente.toUpperCase()} ${remitente.ApellidosRemitente.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${destinatario.NombreDestinatario.toUpperCase()} ${destinatario.ApellidoPaternoDestinatario.toUpperCase()} ${destinatario.ApellidoMaternoDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          text: `${remitente.DireccionRemitente.toUpperCase()}, CP. ${
                            remitente.CodigoPostalRemitente
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${destinatario.DireccionDestinatario.toUpperCase()}, CP. ${destinatario.CodigoPostalDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          text: `${remitente.PaisRemitente.toUpperCase()} / ${remitente.CiudadRemitente.toUpperCase()} / ${remitente.EstadoRemitente.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          text: `${
                            destinatario.MunicipioDelegacionDestinatario.toUpperCase()
                              ? destinatario.MunicipioDelegacionDestinatario.toUpperCase() +
                                " / "
                              : ""
                          }${destinatario.PaisDestinatario.toUpperCase()} / ${destinatario.CiudadDestinatario.toUpperCase()} / ${destinatario.EstadoDestinatario.toUpperCase()}`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          marginBottom: 2.5,
                          text: `${
                            remitente.ReferenciaRemitente &&
                            `REF. ${remitente.ReferenciaRemitente.toUpperCase()}`
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                        {
                          marginBottom: 2.5,
                          text: `${
                            destinatario.ReferenciaDestinatario &&
                            `REF. ${destinatario.ReferenciaDestinatario.toUpperCase()}`
                          }`,
                          alignment: "center",
                          fontSize: TamañoTextoMuyPequeño,
                        },
                      ],
                      [
                        {
                          colSpan: 2,
                          text: `${infoPedido.Peso} lb(s)`,
                          alignment: "center",
                          fontSize: TamañoTextoNormal,
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          text: `Fecha documentación: ${FechaConHora}`,
                          alignment: "center",
                          color: "white",
                          fillColor: "black",
                          fontSize: TamañoTextoPequeño,
                        },
                        {},
                      ],
                      [
                        {
                          colSpan: 2,
                          image:
                            "data:image/png;base64," + png.toString("base64"),
                          marginTop: 2.5,
                          width: 400,
                        },
                        {},
                      ],
                    ],
                  },
                  // Layout personalizado para los bordes solo en los extremos
                  layout: {
                    hLineWidth: function (i, node) {
                      return i === 0 || i === node.table.body.length ? 1 : 0; // Líneas horizontales solo arriba y abajo
                    },
                    vLineWidth: function (i, node) {
                      return i === 0 || i === node.table.widths.length ? 1 : 0; // Líneas verticales solo en los costados
                    },
                    hLineColor: function (i, node) {
                      return "black"; // Color de las líneas horizontales
                    },
                    vLineColor: function (i, node) {
                      return "black"; // Color de las líneas verticales
                    },
                  },
                  marginTop: 25,
                },
                { width: "*", text: "" },
              ],
            },
          ],
          defaultStyle: {
            font: "Roboto", // Establece la fuente predeterminada para todo el documento
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          },
          pageMargins: [10, 10, 10, 10],
        };
        // CREAMOS EL DOCUMENTO PDF
        const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);
        // Generar el PDF y guardarlo en un archivo
        const RutaDelPDF = path.join(PdfURL, NombreDeLaEtiqueta);
        // Guarda el documento PDF en un archivo
        pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
        pdfDoc.end();
      }
    }
  );
};
export const CrearPaqueteDeTicketsPedidos = (
  NombreDelPaqueteDeTickets,
  remitente,
  destinatario,
  ListaDeGuias,
  pedido
) => {
  const CantidadDePedidos = pedido.length - 1;

  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Formato de 24 horas
  };
  const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);

  // ASIGNAMOS LA FUENTE AL PDF
  const Fuente = {
    Roboto: {
      normal: path.join(FuenteURL, "Ticketing.ttf"),
    },
  };

  var ImpresorDelPDF = new createPdf(Fuente);

  // DEFINIMOS EL TAMAÑO DE LA PAGINA
  const TamañoDePagina = {
    width: TamañoDelTicket,
    height: "auto", // Altura automática
  };

  // IMAGEN DEL LOGO
  const ImagenDelPDF = path.join(imgURL, "ImagenTicketPedido.png");

  // DEFINIMOS EL DOCUMENTO PDF
  const CuerpoDelPDF = {
    pageSize: TamañoDePagina,
    content: pedido.map((infoPedido, index) => [
      {
        image: ImagenDelPDF,
        width: 50,
        height: 50,
        alignment: "center",
        marginBottom: 2.5,
      },
      {
        text: "Envía MGS",
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        text: "Ciudad, Estado",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: "Dirección del local",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: `Fecha y hora ${FechaConHora}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "Número de guía",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: ListaDeGuias[index],
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "REMITENTE",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${remitente.NombreRemitente} ${remitente.ApellidosRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "DESTINATARIO",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${destinatario.NombreDestinatario} ${destinatario.ApellidoPaternoDestinatario} ${destinatario.ApellidoMaternoDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      destinatario.CelularDestinatario || destinatario.TelefonoCasaDestinatario
        ? {
            text: `Telefono(s): ${destinatario.CelularDestinatario}${
              destinatario.TelefonoCasaDestinatario &&
              ` - ${destinatario.TelefonoCasaDestinatario}`
            }`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          }
        : {
            text: `Teléfono(s): N/A`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
      {
        text: `${
          destinatario.MunicipioDelegacionDestinatario &&
          `${destinatario.MunicipioDelegacionDestinatario}, `
        }${destinatario.DireccionDestinatario}, CP. ${
          destinatario.CodigoPostalDestinatario
        }`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `${destinatario.PaisDestinatario} / ${destinatario.EstadoDestinatario} / ${destinatario.CiudadDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      destinatario.ReferenciaDestinatario && {
        text: `Ref. ${destinatario.ReferenciaDestinatario}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: infoPedido.Producto,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Ancho: ${infoPedido.Ancho} - Largo: ${infoPedido.Largo} - Alto: ${infoPedido.Alto}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Peso: ${infoPedido.Peso} lb(s)`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Costo envío ${infoPedido.CostoEnvio.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })} | TCF: $0.00 | Costo seguro ${infoPedido.CostoSeguro.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )} | Costo sobre peso ${infoPedido.CostoSobrePeso.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `TOTAL: ${infoPedido.Total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}`,
        alignment: "center",
        fontSize: TamañoTextoNormal,
        margin: [0, 5, 0, 2.5],
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        qr: `${LINK_QR}${ListaDeGuias[index]}`,
        fit: 90,
        alignment: "center",
        margin: [0, 10],
      },
      // {
      //   text: HOST,
      //   alignment: "center",
      //   fontSize: TamañoTextoPequeño,
      // },
      {
        text: "PARA CONOCER EL ESTATUS DE TU PAQUETE, ESCANEA EL CÓDIGO QR DE ARRIBA.",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "Agencia:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginTop: 7.5,
      },
      {
        text: infoPedido.NombreAgencia.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "Usuario:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: infoPedido.UsuarioResponsable.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      index < CantidadDePedidos
        ? {
            text: "",
            pageBreak: "after",
          }
        : null,
    ]),
    defaultStyle: {
      font: "Roboto",
    },
    pageMargins: [10, 10, 10, 10],
  };

  // CREAMOS EL DOCUMENTO PDF
  const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);

  // Generar el PDF y guardarlo en un archivo
  const RutaDelPDF = path.join(PdfURL, NombreDelPaqueteDeTickets);

  // Guarda el documento PDF en un archivo
  pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
  pdfDoc.end();
};
export const CrearTicketDeLaOrden = (
  NombreDelTicket,
  remitente,
  infoOrden,
  GuiaOrden
) => {
  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Formato de 24 horas
  };
  const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);
  // ASIGNAMOS LA FUENTE AL PDF
  const Fuente = {
    Roboto: {
      normal: path.join(FuenteURL, "Ticketing.ttf"),
    },
  };
  var ImpresorDelPDF = new createPdf(Fuente);
  // DEFINIMOS EL TAMAÑO DE LA PAGINA
  const TamañoDePagina = {
    width: TamañoDelTicket,
    height: "auto", // Altura automática
  };
  // IMAGEN DEL LOGO
  const ImagenDelPDF = path.join(imgURL, "ImagenTicketOrden.png");
  // DEFINIMOS EL DOCUMENTO PDF
  const CuerpoDelPDF = {
    pageSize: TamañoDePagina,
    content: [
      {
        image: ImagenDelPDF,
        width: 50,
        height: 50,
        alignment: "center",
        marginBottom: 2.5,
      },
      {
        text: "Envía MGS",
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },

      {
        text: "Ciudad, Estado",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: "Dirección del local",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: `Fecha y hora ${FechaConHora}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: "Número de guía",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: GuiaOrden,
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0, // Ajusta la longitud del separador según el ancho del PDF
            lineWidth: 2, // Ancho del separador
            lineColor: "black", // Color del separador
            dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
          },
        ],
      },
      {
        text: "REMITENTE",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${remitente.NombreRemitente} ${remitente.ApellidosRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      remitente.CelularRemitente || remitente.TelefonoCasaRemitente
        ? {
            text: `Telefono(s): ${remitente.CelularRemitente}${
              remitente.TelefonoCasaRemitente &&
              ` - ${remitente.TelefonoCasaRemitente}`
            }`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          }
        : {
            text: `Teléfono(s): N/A`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
      {
        text: `${remitente.PaisRemitente} / ${remitente.EstadoRemitente} / ${remitente.CiudadRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `${remitente.DireccionRemitente}, CP. ${remitente.CodigoPostalRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      remitente.ReferenciaRemitente && {
        text: `Ref. ${remitente.ReferenciaRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: infoOrden.Producto,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Ancho: ${infoOrden.Ancho || "N/A"} - Largo: ${
          infoOrden.Largo || "N/A"
        } - Alto: ${infoOrden.Alto || "N/A"}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `TOTAL: ${infoOrden.CostoCajaVaciaProducto.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )}`,
        alignment: "center",
        fontSize: TamañoTextoNormal,
        margin: [0, 5, 0, 2.5],
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "Agencia:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginTop: 7.5,
      },
      {
        text: infoOrden.NombreAgencia.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "Usuario:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: infoOrden.UsuarioResponsable.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
    ],
    defaultStyle: {
      font: "Roboto", // Establece la fuente predeterminada para todo el documento
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    pageMargins: [10, 10, 10, 10],
  };
  // CREAMOS EL DOCUMENTO PDF
  const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);
  // Generar el PDF y guardarlo en un archivo
  const RutaDelPDF = path.join(PdfURL, NombreDelTicket);
  // Guarda el documento PDF en un archivo
  pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
  pdfDoc.end();
};
export const CrearPaqueteDeTicketsOrdenes = (
  NombreDelPaqueteDeTickets,
  remitente,
  ListaDeGuias,
  orden
) => {
  const CantidadDeOrdenes = orden.length - 1;

  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Formato de 24 horas
  };
  const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);

  // ASIGNAMOS LA FUENTE AL PDF
  const Fuente = {
    Roboto: {
      normal: path.join(FuenteURL, "Ticketing.ttf"),
    },
  };

  var ImpresorDelPDF = new createPdf(Fuente);

  // DEFINIMOS EL TAMAÑO DE LA PAGINA
  const TamañoDePagina = {
    width: TamañoDelTicket,
    height: "auto", // Altura automática
  };

  // IMAGEN DEL LOGO
  const ImagenDelPDF = path.join(imgURL, "ImagenTicketOrden.png");

  // DEFINIMOS EL DOCUMENTO PDF
  const CuerpoDelPDF = {
    pageSize: TamañoDePagina,
    content: orden.map((infoOrden, index) => [
      {
        image: ImagenDelPDF,
        width: 50,
        height: 50,
        alignment: "center",
        marginBottom: 2.5,
      },
      {
        text: "Envía MGS",
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        text: "Ciudad, Estado",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: "Dirección del local",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: `Fecha y hora ${FechaConHora}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "Número de guía",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        margin: [0, 1.5],
      },
      {
        text: ListaDeGuias[index],
        alignment: "center",
        fontSize: TamañoTextoTitulo,
        margin: [0, 1.5],
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "REMITENTE",
        alignment: "left",
        fontSize: TamañoTextoNormal,
        margin: [0, 1.5],
      },
      {
        text: `${remitente.NombreRemitente} ${remitente.ApellidosRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      remitente.CelularRemitente || remitente.TelefonoCasaRemitente
        ? {
            text: `Telefono(s): ${remitente.CelularRemitente}${
              remitente.TelefonoCasaRemitente &&
              ` - ${remitente.TelefonoCasaRemitente}`
            }`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          }
        : {
            text: `Teléfono(s): N/A`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
      {
        text: `${remitente.PaisRemitente} / ${remitente.EstadoRemitente} / ${remitente.CiudadRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `${remitente.DireccionRemitente}, CP. ${remitente.CodigoPostalRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      remitente.ReferenciaRemitente && {
        text: `Ref. ${remitente.ReferenciaRemitente}`,
        alignment: "left",
        fontSize: TamañoTextoPequeño,
      },
      {
        margin: [0, 10],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: infoOrden.Producto,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `Ancho: ${infoOrden.Ancho || "N/A"} - Largo: ${
          infoOrden.Largo || "N/A"
        } - Alto: ${infoOrden.Alto || "N/A"}`,
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: `TOTAL: ${infoOrden.CostoCajaVaciaProducto.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          }
        )}`,
        alignment: "center",
        fontSize: TamañoTextoNormal,
        margin: [0, 5, 0, 2.5],
      },
      {
        margin: [0, 7.5, 0, 2.5],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: TamañoDeLaLinea,
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        text: "Agencia:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginTop: 7.5,
      },
      {
        text: infoOrden.NombreAgencia.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
        marginBottom: 7.5,
      },
      {
        text: "Usuario:",
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      {
        text: infoOrden.UsuarioResponsable.toUpperCase(),
        alignment: "center",
        fontSize: TamañoTextoPequeño,
      },
      index < CantidadDeOrdenes
        ? {
            text: "",
            pageBreak: "after",
          }
        : null,
    ]),
    defaultStyle: {
      font: "Roboto",
    },
    pageMargins: [10, 10, 10, 10],
  };

  // CREAMOS EL DOCUMENTO PDF
  const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);

  // Generar el PDF y guardarlo en un archivo
  const RutaDelPDF = path.join(PdfURL, NombreDelPaqueteDeTickets);

  // Guarda el documento PDF en un archivo
  pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
  pdfDoc.end();
};

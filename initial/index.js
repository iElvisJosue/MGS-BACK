// import fs from "fs";
// import https from "https";

import app from "./app.js";
// IMPORTAMOS CONFIGURACIÓN DE BD
import { CONECTAR_DB } from "./db.js";
// IMPORTAMOS EL KEY Y CERTIFICADO DEL SERVER
// import { serverKey, serverCert } from "./config.js";

// NOS CONECTAMOS A LA DB
CONECTAR_DB();

// https
//   .createServer(
//     {
//       key: fs.readFileSync(serverKey),
//       cert: fs.readFileSync(serverCert),
//     },
//     app
//   )
//   .listen(4000, function () {
//     console.log("My HTTPS server listening on port 4000...");
//   });
app.listen(4000, () => {
  console.log("Server is running on port", 4000);
});

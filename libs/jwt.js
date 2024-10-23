// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
import { TOKEN_SECRETO } from "../initial/config.js";

export function CrearTokenDeAcceso(payload) {
  // RESOLVE ES POR SI TODO SALE BIEN
  // REJECT ES POR SI OCURRE UN ERROR
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRETO, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

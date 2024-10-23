import jwt from "jsonwebtoken";
import { TOKEN_SECRETO } from "../initial/config.js";

export const ValidarTokenParaPeticion = async (TokenDeAcceso) => {
  return new Promise((resolve, reject) => {
    jwt.verify(TokenDeAcceso, TOKEN_SECRETO, (err) => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
};
export const ObtenerHoraActual = () => {
  const Hoy = new Date();
  const Opciones = {
    timeZone: "America/Mexico_City",
    hour12: false, // Formato de 24 horas
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const HoraActual = Hoy.toLocaleTimeString("en-US", Opciones);
  return HoraActual;
};

export const CrearGuia = () => {
  const numeros = "0123456789";
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let Guia = "";

  for (let i = 0; i < 3; i++) {
    const indiceNum = Math.floor(Math.random() * numeros.length);
    Guia += numeros[indiceNum];
  }

  for (let i = 0; i < 4; i++) {
    const indiceLetra = Math.floor(Math.random() * letras.length);
    Guia += letras[indiceLetra];
  }

  Guia = Guia.split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return Guia;
};

export const CrearCódigoDeRastreo = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

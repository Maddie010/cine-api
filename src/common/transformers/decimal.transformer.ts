import { ValueTransformer } from 'typeorm';

/**
 * MySQL devuelve las columnas DECIMAL como string ("35.00").
 * Este transformer las convierte a number al leerlas de la base de datos.
 */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | number | null) =>
    value === null || value === undefined ? value : Number(value),
};

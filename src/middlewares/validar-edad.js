import { check } from 'express-validator';


const validarEdadMinima = (minEdad = 14) => {
    return check('fecha_nacimiento_usuario')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .isDate().withMessage('La fecha de nacimiento debe ser una fecha válida')
        .custom((value) => {
            const hoy = new Date();
            const fechaNacimiento = new Date(value);
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            const dia = hoy.getDate() - fechaNacimiento.getDate();

            // Ajusta edad si el mes o el día aún no han pasado en el año actual
            if (mes < 0 || (mes === 0 && dia < 0)) {
                edad--;
            }

            if (edad < minEdad) {
                throw new Error(`Debe tener al menos ${minEdad} años para registrarse`);
            }
            return true;
        });
};

export { validarEdadMinima };

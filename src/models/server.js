// src/models/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import { initialize, close } from '../../db/connection.js';
import routerUser from '../routes/usuarios.js';
import routerAuth from '../routes/auth.js';
import routerEstadoUsuario from '../routes/estados-usuarios.js';
import routerRoles from '../routes/roles.js';
import routerFormularios from '../routes/formularios.js';
import routerPerfiles from '../routes/perfiles.js';

import { validarJWT  } from "../middlewares/index.js";
import { esAdminRole, esClienteRole, esDelegadoRole, esInventariosRole, esVendedorRole } from "../middlewares/validar-rol.js";

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.__dirname = path.dirname(fileURLToPath(import.meta.url));

        this.paths = {
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            estadoUsuarios: '/api/estado-usuarios',
            roles: '/api/roles',
            formularios: '/api/formularios',
            perfiles: '/api/perfiles',
            admin: '/admin',
            delegado: '/delegado',
            inventarios: '/inventarios',
            vendedor: '/vendedor',
            cliente: '/cliente',
            login: '/login',
            registro: '/registroUsuario'
        };

        // Métodos iniciales
        this.dbConnection();
        this.middlewares();
        // Rutas de la aplicación
        this.routes();

        // Motor de plantillas (EJS en este caso)
        this.app.set('views', path.join(this.__dirname, '../pages'));
        this.app.set('view engine', 'ejs');
    }

    async dbConnection() {
        try {
            await initialize();
            console.log('Conectado - Database');
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        this.app.use(cookieParser());
        // Manejo de errores global
        this.app.use(this.errorHandler);
    }

    routes() {
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.usuarios, routerUser);
        this.app.use(this.paths.estadoUsuarios, routerEstadoUsuario);
        this.app.use(this.paths.roles, routerRoles);
        this.app.use(this.paths.formularios, routerFormularios);
        this.app.use(this.paths.perfiles, routerPerfiles);

        //Rutas publicas
        this.app.get(this.paths.login, (req, res) => {
            res.render(path.join(this.__dirname, '/../pages/login.ejs'));
        });
         

        // Rutas protegidas por rol
        this.app.get(this.paths.admin, [validarJWT, esAdminRole], (req, res) => {
            res.render("admin", { usuario: req.usuario });
        });

        this.app.get(this.paths.delegado, [validarJWT, esDelegadoRole], (req, res) => {
            res.render("delegado", { usuario: req.usuario });
        });

        this.app.get(this.paths.inventarios, [validarJWT, esInventariosRole], (req, res) => {
            res.render("inventarios", { usuario: req.usuario });
        });

        this.app.get(this.paths.vendedor, [validarJWT, esVendedorRole], (req, res) => {
            res.render("vendedor", { usuario: req.usuario });
        });

        this.app.get(this.paths.cliente, [validarJWT, esClienteRole], (req, res) => {
            res.render("cliente", { usuario: req.usuario });
        });

        //Manejo de errores
        this.app.get(this.paths.admin, [validarJWT, esAdminRole], (req, res) => {
            try {
                res.render(path.join(this.__dirname, '../pages/admin.ejs'), { usuario: req.usuario });
            } catch (error) {
                console.error('Error al cargar la vista:', error);
                res.render(path.join(this.__dirname, '../pages/error.ejs'), { error: 'Error al cargar la vista de administrador' });
            }
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });

        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            await close();
            this.app.close(() => {
                console.log('HTTP server closed');
            });
        });

        process.on('SIGINT', async () => {
            console.log('SIGINT signal received: closing HTTP server');
            await close();
            this.app.close(() => {
                console.log('HTTP server closed');
            });
        });
    }

    errorHandler(err, req, res, next) {
        console.error(err.stack);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { Server };
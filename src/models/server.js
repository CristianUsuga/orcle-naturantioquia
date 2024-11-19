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

import { methods as validarRol } from "../middlewares/index.js";


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.__dirname = path.dirname(fileURLToPath(import.meta.url));

        this.paths = {
            imagenesAPI: '/api/imagenes',
            estadoUsuarios: '/api/estado-usuarios',
            roles: '/api/roles',
            formularios: '/api/formularios',
            categoriasProductosAPI: '/api/categoriasProductos',
            categoriasAPI: '/api/categorias',
            productosAPI: '/api/productos',
            usuarios: '/api/usuarios',
            login: '/login',
            registro: '/registroUsuario',
            ingresar: '/api/auth',
            admin: '/admin',
            log: '/logeado',
            about: '/about',
            contact: '/contact',
            services: '/services',
            laboratorios: '/api/laboratorios',
            laboratorio: '/laboratorio',
            transportistas: '/api/transportistas',
            transportista: '/transportista'
        };

        // Métodos iniciales
        this.dbConnection();
        this.middlewares();
        // Rutas de la aplicación
        this.routes();

        // Motor de plantillas (EJS en este caso)
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
        // Definir las rutas API
        this.app.use(this.paths.usuarios, routerUser);
        this.app.use(this.paths.ingresar, routerAuth ); 
        this.app.use(this.paths.estadoUsuarios, routerEstadoUsuario );
        this.app.use(this.paths.roles, routerRoles );
        this.app.use(this.paths.formularios, routerFormularios );
        // this.app.use(this.paths.laboratorios, laboratoriosRouter);
        // this.app.use(this.paths.productosAPI, productosRouter);
        // this.app.use(this.paths.transportistas, transportistasRouter);
        // this.app.use(this.paths.categoriasAPI, routerCategorias);
        // this.app.use(this.paths.categoriasProductosAPI, routerCategoriasProductos);
        // this.app.use(this.paths.imagenesAPI, routerImagenesProductos);

        // Pages
        this.app.get(this.paths.login, validarRol.soloPublico, (req, res) => res.render(path.join(this.__dirname, '/../pages/login.ejs')));
        this.app.get(this.paths.registro, validarRol.soloPublico, (req, res) => res.render(path.join(this.__dirname, '/../pages/register.ejs')));
        this.app.get(this.paths.about, validarRol.soloPublico, (req, res) => res.render(path.join(this.__dirname, '/../pages/about.ejs')));
        this.app.get(this.paths.contact, validarRol.soloPublico, (req, res) => res.render(path.join(this.__dirname, '/../pages/contact.ejs')));
        this.app.get(this.paths.services, validarRol.soloPublico, (req, res) => res.render(path.join(this.__dirname, '/../pages/services.ejs')));

        this.app.get(this.paths.admin, validarRol.soloAdmin, (req, res) => res.render(path.join(this.__dirname, '/../pages/admin.ejs')));
        this.app.get(this.paths.laboratorio, validarRol.soloAdmin, (req, res) => res.render(path.join(this.__dirname, '/../pages/forms/laboratorios.ejs')));
        this.app.get(this.paths.transportista, validarRol.soloAdmin, (req, res) => res.render(path.join(this.__dirname, '/../pages/forms/transportistas.ejs')));
        
        // TODO: agregar validar rol después a logeado
        this.app.get(this.paths.log, (req, res) => res.render(path.join(this.__dirname, '/../pages/logeado.ejs')));
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

import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

async function initialize() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING,
            poolMin: 10,
            poolMax: 10,
            poolIncrement: 0
        });
        console.log('Connection pool started');
    } catch (err) {
        console.error('initialize() error: ' + err.message);
    }
}

async function close() {
    try {
        await oracledb.getPool().close(10);
        console.log('Connection pool closed');
    } catch (err) {
        console.error('close() error: ' + err.message);
    }
}

export { initialize, close };

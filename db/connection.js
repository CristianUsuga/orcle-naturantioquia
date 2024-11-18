import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Configura el nivel de depuración
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

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
// Función adicional para registrar consultas en consola
async function executeQuery(query, params = []) {
    try {
        const connection = await oracledb.getConnection();
        console.log(`Executing query: ${query}`);
        const result = await connection.execute(query, params);
        console.log('Query result:', result);
        await connection.close();
    } catch (err) {
        console.error('Error executing query:', err);
    }
}
export { initialize, close, executeQuery  };

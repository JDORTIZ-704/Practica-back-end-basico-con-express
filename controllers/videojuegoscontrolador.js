const { pool } = require('../config/baseDatos.js');

const obtenerTodosLosVideojuegos = async (req, res) => {
    try {
        const consulta = 'SELECT * FROM videojuegos ORDER BY id ASC';
        const resultado = await pool.query(consulta); // Llama la conexión de la BD y ejecuta la consulta almacenada

        res.json({
            exito: true,
            mensaje: 'Videojuegos obtenidos correctamente',
            datos: resultado.rows,
            total: resultado.rows.length
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener los videojuegos',
            error: error.message
        });
    }
};

const obtenerVideoJuegoPorId = async (req, res) => {
    try {
        const {id} = req.params; // Recolecta la variable del 'reques'
        const consulta = 'SELECT * FROM videojuegos WHERE id = $1';
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows == 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        } 

        res.json({
            exito: true,
            mensaje: 'vieojuego encontrado',
            datos: resultado.rows[0]
        })


    } catch (error) {
        console.error('Error:', error); // Imprime el error que registra mismo JS
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener el videojuego',
            error: error.message
        });
    }
}

const crearVideojuego = async (req, res) => {
    try {
        // Aquí se recolecta toda la infomación que va a venir en el body
        const {nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion} = req.body;
        
        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }

        const consulta = `
        INSERT INTO videojuegos (nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion];

        const resultado = await pool.query(consulta, valores);

        res.status(201).json({
            exito: true,
            mensaje: 'videojuego creado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error:', error); // Imprime el error que registra mismo JS
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear el videojuego',
            error: error.message
        });
    }
}

const actualizarVideojuego = async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion} = req.body;

        if (!nombre || !genero || !plataforma || !precio) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, género, plataforma y precio son obligatorios'
            });
        }
        
        const consulta = `
            UPDATE videojuegos SET nombre = $1, genero = $2, plataforma = $3, precio = $4, fecha_lanzamiento = $5, desarrollador = $6 , descripcion= $7
            WHERE id = $8
            RETURNING *
        `;

        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, id];

        const resultado = await pool.query(consulta, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(201).json({
            exito: true,
            mensaje: ' Videjuego actualizado correctamente',
            datos: resultado.rows[0]
        })


    } catch (error) {
        console.error('Error:', error); // Imprime el error que registra mismo JS
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el videojuego',
            error: error.message
        });
    }
} 

const elimiarVideojuego = async (req, res) => {
    try {
        const {id} = req.params;
        const consulta = `DELETE FROM videojuegos WHERE id = $1 RETURNING *`;
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        res.status(201).json({
            exito: true,
            mensaje: ' Videjuego eliminado correctamente',
            datos: resultado.rows[0]
        })
        
        
    } catch (error) {
        console.error('Error:', error); // Imprime el error que registra mismo JS
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar el videojuego',
            error: error.message
        });
    }
}

// Exporta las funciones creadas a otros archivos JS
module.exports = {
    obtenerTodosLosVideojuegos,
    obtenerVideoJuegoPorId,
    crearVideojuego,
    actualizarVideojuego,
    elimiarVideojuego
}
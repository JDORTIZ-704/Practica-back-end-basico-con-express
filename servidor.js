const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { probarConexion } = require('./config/baseDatos.js');
const { obtenerTodosLosVideojuegos, obtenerVideoJuegoPorId, crearVideojuego, actualizarVideojuego, elimiarVideojuego} = require('./controllers/videojuegoscontrolador.js')


const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Api Videojuegos</title>
    <style>
        html{
            height: 100%;
        }
        body{
            margin: 0;
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
        }
    </style>
</head>
<body>
    <div>
        <h1>API de videojuegos funcionando</h1>
        <p>Servidor Activo</p>
    </div>
</body>
</html>`
    );
});

app.get('/api/videojuegos', obtenerTodosLosVideojuegos); //Llama el servicio creado y crea la ruta a poner en la URL
app.get('/api/videojuegos/:id', obtenerVideoJuegoPorId);
app.post('/api/videojuegos', crearVideojuego);
app.put('/api/videojuegos/:id', actualizarVideojuego);
app.delete('/api/videojuegos/:id', elimiarVideojuego);

const iniciarServidor = async () => {
    try {
        await probarConexion();
        // Verificar si el servidor está funcionando
        app.listen(puerto, () => { //Llama la conexión del prueto y a express
            console.log(`Servidor escuchando en http://localhost:${puerto}`);
        })
    } catch (error) {
        console.error('Error al iniciar: ', error.message)
    }
}

iniciarServidor();
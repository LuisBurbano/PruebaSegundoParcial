const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware para manejar CORS
app.use(cors());
app.use(express.json());

// Rutas
const databasePath = path.resolve(__dirname, '../database');

// Inicializar archivos de datos si no existen
const initializeDataFile = (fileName, defaultData = []) => {
    const filePath = path.join(databasePath, `${fileName}.js`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(defaultData, null, 2)};`);
    }
};

initializeDataFile('questionnaires', []);

let questionnairesData = require('../database/questionnaires');

app.get('/questionnaires', (req, res) => {
    try {
        res.json(questionnairesData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/questionnaires', (req, res) => {
    try {
        const newQuestionnaire = {
            id: questionnairesData.length + 1,
            questions: req.body.questions,
        };

        questionnairesData.push(newQuestionnaire);
        fs.writeFileSync(path.join(databasePath, 'questionnaires.js'), `module.exports = ${JSON.stringify(questionnairesData, null, 2)};`);

        res.json(newQuestionnaire);
    } catch (error) {
        console.error('Error en POST /questionnaires:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend en ejecución en http://localhost:${PORT}`);
});

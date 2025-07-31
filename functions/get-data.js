// functions/get-citas.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
    try {
        // 1. Carga las credenciales desde las variables de entorno de Netlify (¡Seguro!)
        const creds = JSON.parse(process.env.GOOGLE_CREDS);
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        // 2. Autentica con Google
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // Carga las propiedades del documento

        // 3. Obtiene los datos de cada hoja
        const citasSheet = doc.sheetsByTitle['citas'];
        const serviciosSheet = doc.sheetsByTitle['servicios'];
        const doctoresSheet = doc.sheetsByTitle['doctores'];

        const citasRows = await citasSheet.getRows();
        const serviciosRows = await serviciosSheet.getRows();
        const doctoresRows = await doctoresSheet.getRows();

        // 4. Formatea los datos para enviarlos a la web
        const data = {
            citas: citasRows.map(row => row.toObject()),
            servicios: serviciosRows.map(row => row.toObject()),
            doctores: doctoresRows.map(row => row.toObject()),
        };

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al obtener los datos de la hoja de cálculo.' }),
        };
    }
};

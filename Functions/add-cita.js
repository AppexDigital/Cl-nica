// functions/add-cita.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function getDoc() {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    return doc;
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['citas'];
        const newCita = JSON.parse(event.body);

        // Añade la nueva fila a la hoja 'citas'
        await sheet.addRow(newCita);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Cita agregada con éxito' }),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al guardar la nueva cita.' }),
        };
    }
};

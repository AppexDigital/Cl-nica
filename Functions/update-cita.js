// functions/update-cita.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function getDoc() {
    const creds = JSON.parse(process.env.GOOGLE_CREDS);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    return doc;
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['citas'];
        const updatedCita = JSON.parse(event.body);

        // Busca la fila que coincida con el ID de la cita a actualizar
        const rows = await sheet.getRows();
        const rowToUpdate = rows.find(row => row.get('id') === updatedCita.id);

        if (rowToUpdate) {
            // Actualiza cada campo de la fila con los nuevos datos
            Object.keys(updatedCita).forEach(key => {
                rowToUpdate.set(key, updatedCita[key]);
            });
            await rowToUpdate.save(); // Guarda los cambios en la hoja

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Cita actualizada con éxito' }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No se encontró la cita para actualizar.' }),
            };
        }

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al actualizar la cita.' }),
        };
    }
};

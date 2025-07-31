// functions/get-data.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Función helper para inicializar la autenticación y el documento
async function getDoc() {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

exports.handler = async function(event, context) {
  try {
    const doc = await getDoc();
    const citasSheet = doc.sheetsByTitle['citas'];
    const serviciosSheet = doc.sheetsByTitle['servicios'];
    const doctoresSheet = doc.sheetsByTitle['doctores'];

    const citasRows = await citasSheet.getRows();
    const serviciosRows = await serviciosSheet.getRows();
    const doctoresRows = await doctoresSheet.getRows();

    const data = {
      citas: citasRows.map(row => row.toObject()),
      servicios: serviciosRows.map(row => row.toObject()),
      doctores: doctoresRows.map(row => row.toObject()),
    };

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al obtener los datos.' }) };
  }
};


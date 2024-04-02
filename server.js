// server.js

const express = require('express'); // Importiere den express-Webserver
const knex = require('knex'); // Importiere den knex-Querybuilder
const cors = require('cors'); // Importiere das cors-Modul

const app = express(); // Erstelle eine Instanz des express-Webserver
const PORT = 3001; // Definiere den Port, auf dem der Webserver laufen soll


app.use(cors()); // Aktiviere CORS für den Webserver

// Konfiguration für die MySQL-Datenbank
const db = knex({
    client: 'mysql2',
    connection: {
        host: 'photograph.mysql.database.azure.com',
        port: 3306,
        user: 'samuel',
        password: 'Fotograf03',
        database: 'anfragen',
    },
});

app.use(express.json()); // Aktiviere das Parsen von JSON-Requests

// Test-Route
app.get('/test', (req, res) => {
    res.send('Hello from express server from Azure');
})

// Endpunkt zum Einfügen von allgemeinen Anfragen in die Datenbank
app.post('/InsertAllgemeineAnfragen', async (req, res) => {
    const {vorname, nachname, tag, wuensche, vorstellungen, mail, anmerkungen} = req.body; // Annahme: Die Werte für front und back kommen im Request Body an
    console.log(req.body);
    console.log(vorname, nachname);
    if (!vorname || !nachname || !tag || !mail) {
        res.status(400).send('Es fehlen erforderliche Felder.');
        return;
    }
    try {
        const card = await db.insert({
            vorname: vorname,
            nachname: nachname,
            tag: tag,
            wuensche: wuensche,
            vorstellungen: vorstellungen,
            mail: mail,
            anmerkungen: anmerkungen
        }).into('allgemein');
        res.status(201).json({ id: card.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ein Fehler ist aufgetreten.');
    }

})

// Endpunkt zum Einfügen von individuellen Anfragen in die Datenbank
app.post('/InsertIndividuelleAnfragen', async (req, res) => {
    const {vorname, nachname, email, kategorie, motiv, stunden, bilder, tag, kosten} = req.body; // Annahme: Die Werte für front und back kommen im Request Body an
    console.log(req.body);
    try {
        const card = await db.insert({
            vorname: vorname,
            nachname: nachname,
            email: email,
            kategorie: kategorie,
            motiv: motiv,
            stunden: stunden,
            bilder: bilder,
            tag: tag,
            kosten: kosten
        }).into('individuell');
        console.log("1")
        res.status(201).send('Eintrag erfolgreich erstellt.');
        console.log("2")
    } catch (error) {
        console.error(error);
        res.status(400).send('Ein Fehler ist aufgetreten.');
    }

})

// Endpunkt zum Berechnen des Preises, der auf der Webseite angezeigt wird
app.post('/calculatePrice', async (req, res) => {
    const {category, motiv, stunden, bilder} = req.body;
    console.log(req.body);

    if (category === "Tier") {
        const anfragen = motiv.length;
        console.log(anfragen);
        if (anfragen === 1) {
            motivpreis = 0;
        } else if (anfragen === 2) {
            motivpreis = 40;
        } else if (anfragen === 3) {
            motivpreis = 60;
        } else if (anfragen === 0) {
            motivpreis = 0;
        }
        const price = 500 + motivpreis + (stunden * 100) + (bilder * 5);
        console.log(price);
        res.json(price);
    } else if (category === "Auto") {
        const anfragen = motiv.length;
        console.log(anfragen);
        if (anfragen === 1) {
            motivpreis = 0;
        } else if (anfragen === 2) {
            motivpreis = 40;
        } else if (anfragen === 3) {
            motivpreis = 60;
        } else if (anfragen === 0) {
            motivpreis = 0;
        }
        const price = 250 + motivpreis + (stunden * 100) + (bilder * 5);
        console.log(price);
        res.json(price);
    } else if (category === "Mensch") {
        const anfragen = motiv.length;
        console.log(anfragen);
        if (anfragen === 1) {
            motivpreis = 0;
        } else if (anfragen === 2) {
            motivpreis = 40;
        } else if (anfragen === 0) {
            motivpreis = 0;
        }
        const price = 100 + motivpreis + (stunden * 100) + (bilder * 5);
        console.log(price);
        res.json(price);
    } else {
        res.status(400).send('Invalid category');
    }

})

//Muss am Schluss sein, da vor dem Starten erstmal alles definiert werden muss
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const address = app.listen().address();
    console.log(`Server address: ${address.port}`);
});
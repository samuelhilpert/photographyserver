
const app = require('./server.js');
const request = require('supertest');// Stelle sicher, dass der Pfad korrekt ist


describe('GET /test', () => {
    it('responds with "Hello from express server"', async () => {
        const response = await request('localhost:3001').get('/test');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello from express server');
    });
});


describe('POST /InsertAllgemeineAnfragen', () => {
    it('inserts data into the `allgemein` table and returns a 201 status code', async () => {
        const data = {
            vorname: 'Max',
            nachname: 'Mustermann',
            tag: '2024-03-30T23:00:00.000Z',
            wuensche: 'Test',
            vorstellungen: 'Test',
            mail: 'max.mustermann@example.com',
            anmerkungen: 'Dies ist ein Test',
        };

        const response = await request('localhost:3001').post('/InsertAllgemeineAnfragen').send(data);

        expect(response.status).toBe(201);
        //expect(response.body).toHaveProperty('id'); // Wenn die DB ein ID zurückgibt
    });

    it('returns a 400 error if the request body is invalid', async () => {
        const invalidData = {
            vorname: 'Max',
            // 'nachname' fehlt
            tag: '2024-03-30T23:00:00.000Z',
            wuensche: 'Test',
            vorstellungen: 'Test',
            mail: 'max.mustermann@example.com',
            anmerkungen: 'Dies ist ein Test',
        };

        const response = await request('localhost:3001').post('/InsertAllgemeineAnfragen').send(invalidData);

        expect(response.status).toBe(400);
    });
});

describe('POST /InsertIndividuelleAnfragen', () => {
    it('inserts data into the `individuell` table and returns a 201 status code', async () => {
        const data = {
            vorname: 'Max',
            nachname: 'Mustermann',
            email: 'max.mustermann@example.com',
            kategorie: 'Kategorie 1',
            motiv: 'Motiv 1',
            stunden: 10,
            bilder: '2',
            tag: '2024-03-30T23:00:00.000Z',
            kosten: 1000,
        };

        const response = await request('localhost:3001').post('/InsertIndividuelleAnfragen').send(data);

        expect(response.status).toBe(201);
    });

    it('returns a 400 error if the request body is invalid', async () => {
        const invalidData = {
            vorname: 'Max',
            // 'nachname' fehlt
            email: 'max.mustermann@example.com',
            kategorie: 'Kategorie 1',
            motiv: 'Motiv 1',
            stunden: 10,
            bilder: ['Bild 1', 'Bild 2'],
            tag: '2024-03-30T23:00:00.000Z',
            kosten: 1000,
        };

        const response = await request('localhost:3001').post('/InsertIndividuelleAnfragen').send(invalidData);

        expect(response.status).toBe(400);
    });
});
describe('POST /calculatePrice', () => {
    it('returns the correct price for a Tier category with no motif', async () => {
        const data = {
            category: 'Tier',
            motiv: [],
            stunden: 2,
            bilder: 3,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(715);
    });
    it('returns the correct price for a Tier category with one motif', async () => {
        const data = {
            category: 'Tier',
            motiv: ['Motiv 1'],
            stunden: 2,
            bilder: 3,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(715);
    });

    it('returns the correct price for a Tier category with two motifs', async () => {
        const data = {
            category: 'Tier',
            motiv: ['Motiv 1', 'Motiv 2'],
            stunden: 1,
            bilder: 1,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(645);
    });
    it('returns the correct price for a Tier category with three motifs', async () => {
        const data = {
            category: 'Tier',
            motiv: ['Motiv 1', 'Motiv 2', 'Motiv 3'],
            stunden: 1,
            bilder: 1,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(665);
    });
    it('returns the correct price for a Auto category with no motifs', async () => {
        const data = {
            category: 'Auto',
            motiv: [],
            stunden: 3,
            bilder: 0,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(550);
    });

    it('returns the correct price for a Auto category with one motifs', async () => {
        const data = {
            category: 'Auto',
            motiv: ['Motiv 1'],
            stunden: 3,
            bilder: 0,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(550);
    });
    it('returns the correct price for a Auto category with two motifs', async () => {
        const data = {
            category: 'Auto',
            motiv: ['Motiv 1', 'Motiv 2'],
            stunden: 3,
            bilder: 0,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(590);
    });

    it('returns the correct price for a Auto category with three motifs', async () => {
        const data = {
            category: 'Auto',
            motiv: ['Motiv 1', 'Motiv 2', 'Motiv 3'],
            stunden: 3,
            bilder: 0,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(610);
    });

    it('returns the correct price for a Mensch category with no motifs', async () => {
        const data = {
            category: 'Mensch',
            motiv: [],
            stunden: 4,
            bilder: 2,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(510);
    });

    it('returns the correct price for a Mensch category with one motifs', async () => {
        const data = {
            category: 'Mensch',
            motiv: ['Motiv 1'],
            stunden: 4,
            bilder: 2,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(510);
    });
    it('returns the correct price for a Mensch category with two motifs', async () => {
        const data = {
            category: 'Mensch',
            motiv: ['Motiv 1', 'Motiv 2'],
            stunden: 4,
            bilder: 2,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(200);
        expect(response.body).toBe(550);
    });


    it('returns a 400 error for an invalid category', async () => {
        const data = {
            category: 'Invalid',
            motiv: ['Motiv 1'],
            stunden: 2,
            bilder: 3,
        };

        const response = await request('localhost:3001').post('/calculatePrice').send(data);

        expect(response.status).toBe(400);
    });
});


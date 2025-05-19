// server.js
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN_MERCADOPAGO' // ⚠️ Reemplaza esto
});

app.post('/create_preference', async (req, res) => {
    const items = req.body.items;

    const preference = {
        items,
        back_urls: {
            success: "https://tusitio.com/success",
            failure: "https://tusitio.com/failure",
            pending: "https://tusitio.com/pending"
        },
        auto_return: "approved"
    };

    try {
        const response = await mercadopago.preferences.create(preference);
        res.json({ preferenceId: response.body.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

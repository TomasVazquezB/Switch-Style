import express from 'express';
import cors from 'cors';
import mercadopago from 'mercadopago';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mercadopago.configure({
    access_token: 'TEST-69d1d189-3428-4757-b74d-e5ea62900894'
});

app.post('/create_preference', async (req, res) => {
    try {
        const { items } = req.body;

        const preference = {
            items: items,
            back_urls: {
                success: "http://localhost:5173/success",
                failure: "http://localhost:5173/failure",
                pending: "http://localhost:5173/pending"
            },
            auto_return: "approved"
        };

        const response = await mercadopago.preferences.create(preference);
        return res.json({
            preferenceId: response.body.id,
            init_point: response.body.init_point
        });

    } catch (error) {
        console.error("Error al crear preferencia:", error);
        return res.status(500).json({ error: "Error al crear preferencia" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

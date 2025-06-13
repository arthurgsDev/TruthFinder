import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Endpoint para análise de veracidade
app.post('/api/analisar', async (req, res) => {
    const { url, title, content } = req.body;
    const ai = new GoogleGenAI({ apiKey: "AIzaSyB4G99c71FrXxXigZzaS7jSjMqM0Vqe07Q" });

    if (!url || !title || !content) {
        return res.status(400).json({ error: 'Dados incompletos fornecidos.' });
    }

    try {
        const prompt = `Analise a veracidade da seguinte notícia, considerando que estamos em 2025.\n\nTítulo: ${title}\nURL: ${url}\nConteúdo: ${content}\n\nResponda apenas com o nível de confiança (em porcentagem) e os motivos (até 5 frases curtas explicando a avaliação), sem formato JSON. Exemplo de resposta: Nível de confiança: 95%. Motivos: 1. Motivo 1. 2. Motivo 2. ...`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        console.log(response.text);
        res.send(response.text);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao analisar o conteúdo.', details: error.message });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

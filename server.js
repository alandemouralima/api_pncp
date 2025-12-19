const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para que seu index.html possa acessar este servidor
app.use(cors());
app.use(express.json());

// Base URL da API do Governo
const PNCP_API_BASE = 'https://pncp.gov.br/api/pncp/v1/consultas/licitacoes';

/**
 * Rota Principal de Busca
 * GET /api/licitacoes
 */
app.get('/api/licitacoes', async (req, res) => {
    try {
        const { pagina, tamanhoPagina, dataInicial, dataFinal, objeto, cnpjOrgao } = req.query;

        // Montagem dos parâmetros para a API do Governo
        const params = {
            pagina: pagina || 1,
            tamanhoPagina: tamanhoPagina || 12,
            dataInicial,
            dataFinal,
            ordenacao: 'dataPublicacao',
            tipoOrdenacao: 'desc'
        };

        if (objeto) params.objeto = objeto;
        if (cnpjOrgao) params.cnpjOrgao = cnpjOrgao;

        console.log(`[LOG] Buscando: ${objeto || 'Geral'} em ${cnpjOrgao || 'Todos'}`);

        const response = await axios.get(PNCP_API_BASE, { params });
        
        // Retorna os dados processados para o Frontend
        res.json(response.data);

    } catch (error) {
        console.error('[ERRO] Falha na chamada ao PNCP:', error.message);
        
        const status = error.response ? error.response.status : 500;
        const message = error.response ? `Erro na API do Governo: ${error.response.statusText}` : 'Erro interno no servidor';
        
        res.status(status).json({ error: true, message });
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Backend PNCP rodando em: http://localhost:${PORT}`);
    console.log(`🔧 Endpoint de busca: http://localhost:${PORT}/api/licitacoes`);
    console.log(`=========================================`);
});
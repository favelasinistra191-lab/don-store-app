import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rota da API de Produtos (Busca direta do GitHub DB)
app.get('/api/produtos', async (req, res) => {
  try {
    // IMPORTANTE: Verifique se a branch é 'main' ou 'master' e se o arquivo se chama exatamente 'produtos.json'
    const url = 'https://raw.githubusercontent.com/favelasinistra191-lab/don-store-db/main/produtos.json';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar no GitHub. Status: ${response.status} ${response.statusText}`);
    }
    
    const textData = await response.text();
    
    // Tenta converter para JSON para garantir que o arquivo não está corrompido ou em HTML (erro 404)
    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      throw new Error('O arquivo retornado pelo GitHub não é um JSON válido. Verifique se o link raw está correto.');
    }

    res.json(data);
  } catch (err) {
    console.error('❌ ERRO NO CATÁLOGO:', err.message);
    res.status(500).json({ error: 'Erro ao carregar os dados', details: err.message });
  }
});

// Suporte para navegação de páginas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

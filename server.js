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
    // Altere para a URL exata do seu arquivo produtos.json no repositório de banco de dados
    const url = 'https://raw.githubusercontent.com/favelasinistra191-lab/don-store-db/main/produtos.json';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Erro detalhado ao buscar produtos:', err.message);
    res.status(500).json({ error: 'Erro ao carregar os dados', details: err.message });
  }
});

// Suporte para navegação de páginas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Catálogo de segurança (fallback) caso o GitHub falhe ou demore
const produtosFallback = [
  {
    id: 1,
    nome: "Produto Exemplo Don Store",
    preco: 99.90,
    categoria: "Destaques",
    imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    descricao: "Produto de alta qualidade disponível na loja."
  }
];

// Rota da API de Produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const url = 'https://raw.githubusercontent.com/favelasinistra191-lab/don-store-db/main/produtos.json';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.warn('⚠️ Aviso: Usando catálogo local devido a falha no GitHub:', err.message);
    // Se falhar ao buscar do GitHub, envia os dados locais para o site abrir normalmente sem erros
    res.json(produtosFallback);
  }
});

// Suporte para navegação de páginas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

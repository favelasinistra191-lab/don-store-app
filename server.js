import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'dados.json');

// Produtos Iniciais (Estoque apenas para Netflix, Disney e Smart Fit; O resto via WhatsApp)
const produtosIniciais = [
  {
    id: 1,
    nome: "Netflix 4K (Tela)",
    descricao: "Acesso em Tela 4K Ultra HD com suporte.",
    preco: 15.00,
    categoria: "Streaming",
    entregaTipo: "EMAIL",
    imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=500&auto=format&fit=crop",
    credenciais: [
      "netflix1@donstore.com:senha123 | Perfil: 01",
      "netflix2@donstore.com:senha456 | Perfil: 02"
    ]
  },
  {
    id: 2,
    nome: "Disney+ Premium",
    descricao: "Conta completa Disney+ com suporte garantido.",
    preco: 12.00,
    categoria: "Streaming",
    entregaTipo: "EMAIL",
    imagem: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500&auto=format&fit=crop",
    credenciais: [
      "disney1@donstore.com:senha789"
    ]
  },
  {
    id: 3,
    nome: "Esquema Smart Fit",
    descricao: "Acesso liberado ao plano Smart Fit via esquema.",
    preco: 35.00,
    categoria: "Serviços",
    entregaTipo: "EMAIL",
    imagem: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
    credenciais: [
      "smartfit_token_01:valido2026"
    ]
  },
  {
    id: 4,
    nome: "99 Motorista",
    descricao: "Ativação e cadastro para motorista 99. Finalizado via WhatsApp.",
    preco: 230.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 5,
    nome: "Uber Motorista",
    descricao: "Ativação e liberação para conta Uber Motorista. Finalizado via WhatsApp.",
    preco: 320.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 6,
    nome: "WPlay TV (IPTV)",
    descricao: "Painel e catálogo completo de filmes e séries para sua revenda.",
    preco: 45.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 7,
    nome: "SP Câmera (Segurança)",
    descricao: "Instalação e configuração de sistema de segurança comercial.",
    preco: 150.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  }
];

function carregarBanco() {
  if (!fs.existsSync(DATA_FILE)) {
    const dadosIniciais = {
      produtos: produtosIniciais,
      usuarios: [
        { id: 1, nome: "Admin Don", email: "admin@donstore.com", senha: "admin", isAdmin: true }
      ],
      pedidos: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(dadosIniciais, null, 2));
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { produtos: produtosIniciais, usuarios: [], pedidos: [] };
  }
}

function salvarBanco(dados) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
}

app.get('/api/produtos', (req, res) => {
  const db = carregarBanco();
  const produtosFormatados = db.produtos.map(p => ({
    ...p,
    estoque: p.credenciais ? p.credenciais.length : 0
  }));
  res.json(produtosFormatados);
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  const db = carregarBanco();
  const usuario = db.usuarios.find(u => u.email === email && u.senha === senha);
  if (usuario) {
    res.json({ success: true, usuario: { nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin } });
  } else {
    res.status(401).json({ success: false, error: 'E-mail ou senha incorretos.' });
  }
});

app.post('/api/auth/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  const db = carregarBanco();
  if (db.usuarios.find(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'E-mail já cadastrado.' });
  }
  const novoUsuario = { id: Date.now(), nome, email, senha, isAdmin: false };
  db.usuarios.push(novoUsuario);
  salvarBanco(db);
  res.json({ success: true, usuario: { nome, email, isAdmin: false } });
});

app.post('/api/pedidos', (req, res) => {
  const { produtoId } = req.body;
  const db = carregarBanco();
  const produto = db.produtos.find(p => p.id === produtoId);

  if (!produto) return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
  if (produto.entregaTipo === 'EMAIL') {
    if (!produto.credenciais || produto.credenciais.length === 0) {
      return res.status(400).json({ success: false, error: 'Produto esgotado no momento.' });
    }
    const dadoEntregue = produto.credenciais.shift();
    salvarBanco(db);
    return res.json({ success: true, dadoEntregue });
  }
  res.status(400).json({ success: false, error: 'Este produto é finalizado via WhatsApp.' });
});

app.get('/api/admin/stats', (req, res) => {
  const db = carregarBanco();
  res.json({ produtos: db.produtos });
});

app.post('/api/admin/produtos', (req, res) => {
  const { nome, preco, categoria, entregaTipo, descricao, imagem, credenciaisTexto } = req.body;
  const db = carregarBanco();

  let credenciaisArray = [];
  if (credenciaisTexto && credenciaisTexto.trim() !== '') {
    credenciaisArray = credenciaisTexto.split('\n').map(c => c.trim()).filter(c => c !== '');
  }

  const novoProduto = {
    id: Date.now(),
    nome,
    preco: parseFloat(preco),
    categoria,
    entregaTipo: entregaTipo || 'WHATSAPP',
    descricao: descricao || '',
    imagem: imagem || '',
    credenciais: credenciaisArray
  };

  db.produtos.push(novoProduto);
  salvarBanco(db);
  res.json({ success: true });
});

app.delete('/api/admin/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = carregarBanco();
  db.produtos = db.produtos.filter(p => p.id !== id);
  salvarBanco(db);
  res.json({ success: true });
});

app.post('/api/visita', (req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

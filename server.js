import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SEU NÚMERO OFICIAL DE WHATSAPP
const SEU_WHATSAPP = "5565993416402";

// BANCO DE DADOS EM MEMÓRIA
let db = {
  produtos: [
    // --- STREAMING E OUTROS ---
    {
      id: 1,
      nome: "Tela Netflix 4K",
      descricao: "Plano Premium Individual com envio imediato por e-mail",
      preco: 12.00,
      categoria: "Streaming",
      icone: "fa-solid fa-tv",
      corIcone: "text-red-500",
      entregaTipo: "EMAIL",
      estoque: true,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 2,
      nome: "Disney+",
      descricao: "Acesso Premium Full HD / 4K para filmes e séries",
      preco: 10.00,
      categoria: "Streaming",
      icone: "fa-solid fa-film",
      corIcone: "text-blue-500",
      entregaTipo: "EMAIL",
      estoque: true,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 3,
      nome: "Segunda Via RG / RNI",
      descricao: "Atendimento especializado para emissão e atualização de RG/RNI",
      preco: 120.00,
      categoria: "Documentos",
      icone: "fa-solid fa-id-card",
      corIcone: "text-amber-500",
      entregaTipo: "WHATSAPP",
      estoque: true,
      whatsapp: SEU_WHATSAPP
    },
    // --- PRODUTOS SMART FIT (SEM ESTOQUE POR ENQUANTO) ---
    {
      id: 101,
      nome: "Kit Smart Fit Premium",
      descricao: "Conjunto completo de acessórios para treino de alta performance.",
      preco: 149.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-dumbbell",
      corIcone: "text-red-500",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 102,
      nome: "Camiseta Oficial Dry-Fit",
      descricao: "Tecido tecnológico respirável com estampa exclusiva da marca.",
      preco: 79.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-shirt",
      corIcone: "text-zinc-300",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 103,
      nome: "Garrafa Térmica Aço Inox",
      descricao: "Mantém a temperatura gelada por até 24 horas durante o treino.",
      preco: 89.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-bottle-water",
      corIcone: "text-cyan-400",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 104,
      nome: "Mochila Esportiva Executiva",
      descricao: "Compartimento impermeável para calçados e notebook.",
      preco: 199.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-backpack",
      corIcone: "text-neutral-400",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 105,
      nome: "Toalha de Microfibra Pro",
      descricao: "Super absorvente, compacta e de secagem rápida.",
      preco: 49.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-rug",
      corIcone: "text-emerald-400",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 106,
      nome: "Luvas de Musculação Grip+",
      descricao: "Proteção avançada para palma das mãos com suporte de punho.",
      preco: 69.90,
      categoria: "SmartFit",
      icone: "fa-solid fa-hand",
      corIcone: "text-amber-400",
      entregaTipo: "WHATSAPP",
      estoque: false,
      whatsapp: SEU_WHATSAPP
    }
  ],
  usuarios: [
    { id: 1, nome: "Admin Don", email: "admin@donstore.com", senha: "admin", isAdmin: true, dataCadastro: new Date().toISOString() }
  ],
  pedidos: [],
  estatisticas: { visitas: 0 }
};

// Endpoints
app.post('/api/visita', (req, res) => {
  db.estatisticas.visitas += 1;
  res.json({ visitas: db.estatisticas.visitas });
});

app.get('/api/produtos', (req, res) => {
  res.json(db.produtos);
});

app.post('/api/auth/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });
  if (db.usuarios.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já cadastrado.' });

  const novoUsuario = { id: db.usuarios.length + 1, nome, email, senha, isAdmin: false, dataCadastro: new Date().toISOString() };
  db.usuarios.push(novoUsuario);
  const { senha: _, ...usuarioSeguro } = novoUsuario;
  res.json({ success: true, usuario: usuarioSeguro });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = db.usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
  const { senha: _, ...usuarioSeguro } = usuario;
  res.json({ success: true, usuario: usuarioSeguro });
});

app.post('/api/pedidos', (req, res) => {
  const { usuarioEmail, produtoNome, valor, tipo } = req.body;
  db.pedidos.push({ id: db.pedidos.length + 1, usuarioEmail: usuarioEmail || 'Anônimo', produtoNome, valor, tipo, data: new Date().toISOString() });
  res.json({ success: true });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalVisitas: db.estatisticas.visitas,
    totalClientes: db.usuarios.filter(u => !u.isAdmin).length,
    totalPedidos: db.pedidos.length,
    clientes: db.usuarios.map(({ senha, ...u }) => u),
    pedidos: db.pedidos
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DON STORE] Rodando na porta ${PORT}`);
});

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

const SEU_WHATSAPP = "5565993416402";

let db = {
  produtos: [
    {
      id: 1,
      nome: "Tela Netflix 4K",
      descricao: "Plano Premium Individual com envio imediato por API",
      preco: 12.00,
      categoria: "Streaming",
      icone: "fa-solid fa-tv",
      corIcone: "text-red-500",
      entregaTipo: "EMAIL",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 2,
      nome: "Tela Disney+",
      descricao: "Acesso Premium Full HD / 4K processado via API",
      preco: 10.00,
      categoria: "Streaming",
      icone: "fa-solid fa-film",
      corIcone: "text-blue-500",
      entregaTipo: "EMAIL",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 3,
      nome: "Histórico Escolar",
      descricao: "Documento oficial escolar emitido com rapidez e segurança",
      preco: 120.00,
      categoria: "Serviços",
      icone: "fa-solid fa-graduation-cap",
      corIcone: "text-blue-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 4,
      nome: "Certificado Escolar",
      descricao: "Certificado de conclusão de ensino regular ou supletivo",
      preco: 100.00,
      categoria: "Serviços",
      icone: "fa-solid fa-scroll",
      corIcone: "text-amber-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 5,
      nome: "Esquema SmartFit",
      descricao: "Acesso e procedimentos exclusivos para SmartFit (Conforme estoque)",
      preco: 40.00,
      categoria: "Serviços",
      icone: "fa-solid fa-dumbbell",
      corIcone: "text-yellow-500",
      entregaTipo: "EMAIL",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 6,
      nome: "RG Digital",
      descricao: "Atendimento especializado para emissão e regularização de RG Digital",
      preco: 100.00,
      categoria: "Serviços",
      icone: "fa-solid fa-id-card",
      corIcone: "text-amber-500",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 7,
      nome: "CNH Digital",
      descricao: "Emissão e regularização de CNH com atendimento ágil",
      preco: 140.00,
      categoria: "Serviços",
      icone: "fa-solid fa-id-badge",
      corIcone: "text-emerald-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 8,
      nome: "Comprovante de Residência",
      descricao: "Comprovante válido para fins de endereço",
      preco: 30.00,
      categoria: "Serviços",
      icone: "fa-solid fa-house-chimney",
      corIcone: "text-red-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 9,
      nome: "Atestado Médico",
      descricao: "Documentação de atestado médico com atendimento via WhatsApp",
      preco: 40.00,
      categoria: "Serviços",
      icone: "fa-solid fa-file-medical",
      corIcone: "text-teal-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 10,
      nome: "99 Motorista",
      descricao: "Suporte e cadastro para motorista da plataforma 99",
      preco: 230.00,
      categoria: "Serviços",
      icone: "fa-solid fa-car",
      corIcone: "text-yellow-400",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    },
    {
      id: 11,
      nome: "Uber Motorista",
      descricao: "Suporte, regularização e processos para Uber Motorista",
      preco: 320.00,
      categoria: "Serviços",
      icone: "fa-solid fa-car-side",
      corIcone: "text-slate-200",
      entregaTipo: "WHATSAPP",
      whatsapp: SEU_WHATSAPP
    }
  ],
  usuarios: [
    { id: 1, nome: "Admin Don", email: "admin@donstore.com", senha: "admin", isAdmin: true, dataCadastro: new Date().toISOString() }
  ],
  pedidos: [],
  estatisticas: { visitas: 0 }
};

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

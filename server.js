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

// BANCO DE DADOS DE PRODUTOS COMPLETO (Com classes de ícones FontAwesome profissionais)
const produtos = [
  {
    id: 1,
    nome: "Tela Netflix 4K",
    descricao: "Plano Premium Individual com envio imediato por e-mail",
    preco: 12.00,
    categoria: "Streaming",
    icone: "fa-solid fa-tv",
    corIcone: "text-red-500",
    entregaTipo: "EMAIL",
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
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 4,
    nome: "Renovação CNH",
    descricao: "Serviço de renovação e regularização de CNH",
    preco: 150.00,
    categoria: "Documentos",
    icone: "fa-solid fa-address-book",
    corIcone: "text-emerald-500",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 5,
    nome: "Histórico Escolar",
    descricao: "Emissão de documentação escolar completa oficial",
    preco: 120.00,
    categoria: "Escolar",
    icone: "fa-solid fa-graduation-cap",
    corIcone: "text-purple-500",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 6,
    nome: "Certificado Escolar",
    descricao: "Certificado oficial de Conclusão de Curso/Ensino",
    preco: 80.00,
    categoria: "Escolar",
    icone: "fa-solid fa-award",
    corIcone: "text-yellow-400",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 7,
    nome: "Atestado Médico",
    descricao: "Atestado médico oficial para justificação",
    preco: 35.00,
    categoria: "Documentos",
    icone: "fa-solid fa-file-medical",
    corIcone: "text-rose-500",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 8,
    nome: "Conta 99 Motorista",
    descricao: "Aprovação, suporte e cadastro de conta para motorista 99",
    preco: 250.00,
    categoria: "Contas",
    icone: "fa-solid fa-car",
    corIcone: "text-orange-400",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 9,
    nome: "Conta Uber Motorista",
    descricao: "Aprovação, suporte e cadastro de conta para motorista Uber",
    preco: 320.00,
    categoria: "Contas",
    icone: "fa-solid fa-taxi",
    corIcone: "text-zinc-100",
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  }
];

// ENDPOINTS DA API
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const p = produtos.find(item => item.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(p);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DON STORE] Servidor rodando na porta ${PORT}`);
});

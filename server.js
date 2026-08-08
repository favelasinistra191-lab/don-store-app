const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SEU NÚMERO OFICIAL DE WHATSAPP
const SEU_WHATSAPP = "5565993416402";

// ÍCONES SVG EMBUTIDOS (VETORIAIS NATIVOS NÍTIDOS)
const ICONES = {
  rg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/></svg>',
  cnh: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z"/></svg>',
  historico: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/></svg>',
  netflix: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M5.398 0v24l4.603-1.332V11.23L14.602 24h4.001V0h-4.603v12.77L9.399 0z"/></svg>',
  disney: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>',
  doc: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>'
};

// BANCO DE DADOS COMPLETO DE PRODUTOS E PREÇOS CORRETOS
const produtos = [
  {
    id: 1,
    nome: "Tela Netflix 4K",
    descricao: "Plano Premium Individual com envio imediato por e-mail",
    preco: 12.00,
    categoria: "Streaming",
    imagem: ICONES.netflix,
    entregaTipo: "EMAIL",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 2,
    nome: "Disney+",
    descricao: "Acesso Premium Full HD / 4K para filmes e séries",
    preco: 10.00,
    categoria: "Streaming",
    imagem: ICONES.disney,
    entregaTipo: "EMAIL",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 3,
    nome: "Segunda Via RG / RNI",
    descricao: "Atendimento especializado para emissão e atualização de RG/RNI",
    preco: 120.00,
    categoria: "Documentos",
    imagem: ICONES.rg,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 4,
    nome: "Renovação CNH",
    descricao: "Serviço de renovação e regularização de CNH",
    preco: 150.00,
    categoria: "Documentos",
    imagem: ICONES.cnh,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 5,
    nome: "Histórico Escolar",
    descricao: "Emissão de documentação escolar completa oficial",
    preco: 120.00,
    categoria: "Escolar",
    imagem: ICONES.historico,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 6,
    nome: "Certificado Escolar",
    descricao: "Certificado oficial de Conclusão de Curso/Ensino",
    preco: 80.00,
    categoria: "Escolar",
    imagem: ICONES.historico,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 7,
    nome: "Atestado Médico",
    descricao: "Atestado médico oficial para justificação",
    preco: 35.00,
    categoria: "Documentos",
    imagem: ICONES.doc,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 8,
    nome: "Conta 99 Motorista",
    descricao: "Aprovação, suporte e cadastro de conta para motorista 99",
    preco: 250.00,
    categoria: "Contas",
    imagem: ICONES.doc,
    entregaTipo: "WHATSAPP",
    whatsapp: SEU_WHATSAPP
  },
  {
    id: 9,
    nome: "Conta Uber Motorista",
    descricao: "Aprovação, suporte e cadastro de conta para motorista Uber",
    preco: 320.00,
    categoria: "Contas",
    imagem: ICONES.doc,
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

// SERVIR INDEX CASO ACESSE DIRETO
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DON STORE] Servidor rodando na porta ${PORT}`);
});

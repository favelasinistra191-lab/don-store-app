const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Ícones SVG vetorizados embutidos (não quebram nunca)
const ICONES = {
  rg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/></svg>',
  cnh: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z"/></svg>',
  historico: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/></svg>',
  netflix: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M5.398 0v24l4.603-1.332V11.23L14.602 24h4.001V0h-4.603v12.77L9.399 0z"/></svg>',
  disney: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>'
};

const produtos = [
  {
    id: 1,
    nome: "Netflix",
    descricao: "Tela Netflix 4K - Plano Premium",
    preco: 12.00,
    categoria: "Streaming",
    imagem: ICONES.netflix,
    entregaTipo: "EMAIL",
    whatsapp: "5584999999999"
  },
  {
    id: 2,
    nome: "Disney+",
    descricao: "Plano Full HD / 4K",
    preco: 10.00,
    categoria: "Streaming",
    imagem: ICONES.disney,
    entregaTipo: "EMAIL",
    whatsapp: "5584999999999"
  },
  {
    id: 3,
    nome: "Segunda Via RG",
    descricao: "Emissão e atualização de Documento de Identidade",
    preco: 35.00,
    categoria: "Documentos",
    imagem: ICONES.rg,
    entregaTipo: "WHATSAPP",
    whatsapp: "5584999999999"
  },
  {
    id: 4,
    nome: "Renovação CNH",
    descricao: "Serviço de auxílio na atualização da Carteira de Habilitação",
    preco: 50.00,
    categoria: "Documentos",
    imagem: ICONES.cnh,
    entregaTipo: "WHATSAPP",
    whatsapp: "5584999999999"
  },
  {
    id: 5,
    nome: "Histórico Escolar",
    descricao: "Documentação escolar e certificado de conclusão",
    preco: 45.00,
    categoria: "Escolar",
    imagem: ICONES.historico,
    entregaTipo: "WHATSAPP",
    whatsapp: "5584999999999"
  }
];

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});

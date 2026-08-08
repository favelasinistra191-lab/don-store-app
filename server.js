import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const produtosOficiais = [
  {
    id: "atestado",
    nome: "Atestado Médico",
    preco: 35.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Consultoria e emissão rápida de atestado médico com sigilo total e entrega via WhatsApp.",
    imagem: "https://img.icons8.com/isometric/120/e63946/medical-doctor.png"
  },
  {
    id: "certificado-escolar",
    nome: "Certificado Escolar",
    preco: 80.00,
    categoria: "Escolar",
    whatsapp: "5565993416402",
    descricao: "Certificado de Conclusão de Ensino Médio/Fundamental com verificação rápida.",
    imagem: "https://img.icons8.com/isometric/120/e63946/certificate.png"
  },
  {
    id: "historico-escolar",
    nome: "Histórico Escolar",
    preco: 120.00,
    categoria: "Escolar",
    whatsapp: "5565993416402",
    descricao: "Histórico escolar completo, atualizado e pronto para apresentação.",
    imagem: "https://img.icons8.com/isometric/120/e63946/diploma.png"
  },
  {
    id: "rg-rni",
    nome: "Novo RG / RNI",
    preco: 120.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Emissão e consultoria do Registro Geral (Novo RG) / Carteira de Identidade.",
    imagem: "https://img.icons8.com/isometric/120/e63946/id-card.png"
  },
  {
    id: "cnh",
    nome: "CNH Digital / Física",
    preco: 150.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Ativação e assessoria para CNH categoria A, B ou AB com dados atualizados.",
    imagem: "https://img.icons8.com/isometric/120/e63946/driver-license.png"
  },
  {
    id: "99-motorista",
    nome: "Conta 99 Motorista",
    preco: 250.00,
    categoria: "Contas / Apps",
    whatsapp: "5565993416402",
    descricao: "Ativação e liberação de conta para 99App Motorista pronta para trabalhar imediatamente.",
    imagem: "https://img.icons8.com/color/120/99.png"
  },
  {
    id: "uber-motorista",
    nome: "Conta Uber Motorista",
    preco: 320.00,
    categoria: "Contas / Apps",
    whatsapp: "5565993416402",
    descricao: "Regularização e liberação rápida de conta Uber Motorista com suporte total.",
    imagem: "https://img.icons8.com/color/120/uber.png"
  }
];

app.get('/api/produtos', async (req, res) => {
  try {
    const url = 'https://raw.githubusercontent.com/favelasinistra191-lab/don-store-db/main/produtos.json';
    const response = await fetch(url);
    if (!response.ok) throw new Error('GitHub offline');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json(produtosOficiais);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`DON STORE rodando na porta ${PORT}`));

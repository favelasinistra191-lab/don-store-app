import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Produtos oficiais com preços e WhatsApp configurados
const produtosOficiais = [
  {
    id: "atestado",
    nome: "Atestado Médico",
    preco: 35.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Emissão / Consultoria de atestado médico rápido e seguro com suporte total via WhatsApp.",
    imagem: "https://img.icons8.com/fluency/120/medical-doctor.png"
  },
  {
    id: "certificado-escolar",
    nome: "Certificado Escolar",
    preco: 80.00,
    categoria: "Escolar",
    whatsapp: "5565993416402",
    descricao: "Certificado de conclusão escolar com rápido atendimento e entrega garantida.",
    imagem: "https://img.icons8.com/fluency/120/certificate.png"
  },
  {
    id: "historico-escolar",
    nome: "Histórico Escolar",
    preco: 120.00,
    categoria: "Escolar",
    whatsapp: "5565993416402",
    descricao: "Consultoria e emissão de histórico escolar completo com agilidade.",
    imagem: "https://img.icons8.com/fluency/120/diploma.png"
  },
  {
    id: "rg-rni",
    nome: "Novo RG / RNI",
    preco: 120.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Registro Nacional de Identificação (Novo RG). Atendimento simplificado e rápido.",
    imagem: "https://img.icons8.com/fluency/120/id-card.png"
  },
  {
    id: "cnh",
    nome: "CNH",
    preco: 150.00,
    categoria: "Documentos",
    whatsapp: "5565993416402",
    descricao: "Ativação / Consultoria de Carteira Nacional de Habilitação.",
    imagem: "https://img.icons8.com/fluency/120/driver-license.png"
  },
  {
    id: "99-motorista",
    nome: "Conta 99 Motorista",
    preco: 250.00,
    categoria: "Contas / Apps",
    whatsapp: "5565993416402",
    descricao: "Ativação / Conta 99App Motorista pronta para rodar com suporte dedicado.",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/99_logo.png/800px-99_logo.png"
  },
  {
    id: "uber-motorista",
    nome: "Conta Uber Motorista",
    preco: 320.00,
    categoria: "Contas / Apps",
    whatsapp: "5565993416402",
    descricao: "Ativação de conta Uber Motorista com atendimento rápido e envio seguro.",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
  }
];

// Rota da API de Produtos (Tenta GitHub; se falhar, entrega a lista oficial instantaneamente)
app.get('/api/produtos', async (req, res) => {
  try {
    const url = 'https://raw.githubusercontent.com/favelasinistra191-lab/don-store-db/main/produtos.json';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha no GitHub');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    // Retorna os produtos oficiais imediatamente, sem mostrar erro nenhum para o cliente!
    res.json(produtosOficiais);
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`DON STORE rodando na porta ${PORT}`));

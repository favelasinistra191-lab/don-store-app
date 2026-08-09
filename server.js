import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Configuração do Mercado Pago (Substitua pelo seu Access Token se necessário)
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000' });

// Banco de dados em memória inicial (com os produtos corretos e profissionais)
let produtos = [
  {
    id: 1,
    nome: "Disney+ (Melhor Plano 4K)",
    categoria: "Streaming",
    preco: 19.90,
    descricao: "Assinatura oficial do melhor plano Disney+ com suporte a resolução 4K UHD, HDR e múltiplas telas simultâneas.",
    imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "EMAIL",
    estoque: 10,
    credenciais: ["disney1@donstore.com:senha123", "disney2@donstore.com:senha123"]
  },
  {
    id: 2,
    nome: "Netflix (Plano Premium 4K)",
    categoria: "Streaming",
    preco: 24.90,
    descricao: "Conta Netflix em plano Premium Ultra HD 4K com alta qualidade de som espacial e perfil exclusivo.",
    imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "EMAIL",
    estoque: 8,
    credenciais: ["netflix1@donstore.com:senha123"]
  },
  {
    id: 3,
    nome: "99 Motorista (Ativação / Suporte)",
    categoria: "Serviços",
    preco: 49.90,
    descricao: "Serviço especializado de liberação, suporte e verificação de cadastro para motorista parceiro 99.",
    imagem: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "WHATSAPP",
    estoque: 0,
    credenciais: []
  },
  {
    id: 4,
    nome: "Uber Motorista (Regularização)",
    categoria: "Serviços",
    preco: 59.90,
    descricao: "Assessoria completa para otimização de perfil e regularização de documentos na plataforma Uber.",
    imagem: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "WHATSAPP",
    estoque: 0,
    credenciais: []
  },
  {
    id: 5,
    nome: "CNH Digital (Orientação e Processo)",
    categoria: "Serviços",
    preco: 35.00,
    descricao: "Suporte técnico direcionado para emissão, acesso e regularização da CNH Digital no aplicativo oficial.",
    imagem: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "WHATSAPP",
    estoque: 0,
    credenciais: []
  },
  {
    id: 6,
    nome: "Certificado Escolar / Histórico",
    categoria: "Serviços",
    preco: 89.90,
    descricao: "Documentação escolar formal com especificações completas, histórico de notas e validação.",
    imagem: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    entregaTipo: "WHATSAPP",
    estoque: 0,
    credenciais: []
  }
];

let usuarios = [
  { id: 1, nome: "Administrador", email: "admin@donstore.com", senha: "admin", isAdmin: true }
];

// Rotas da API
app.get('/api/produtos', (req, res) => res.json(produtos));

app.get('/api/produto/:id', (req, res) => {
  const prod = produtos.find(p => p.id == req.params.id);
  if (prod) res.json(prod);
  else res.status(404).json({ error: "Produto não encontrado" });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  const user = usuarios.find(u => u.email === email && u.senha === senha);
  if (user) res.json({ success: true, usuario: user });
  else res.status(401).json({ success: false, error: "Credenciais inválidas" });
});

app.post('/api/auth/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (usuarios.some(u => u.email === email)) return res.status(400).json({ success: false, error: "E-mail já cadastrado" });
  const novoUser = { id: usuarios.length + 1, nome, email, senha, isAdmin: false };
  usuarios.push(novoUser);
  res.json({ success: true, usuario: novoUser });
});

app.post('/api/admin/produtos', (req, res) => {
  const { id, nome, preco, categoria, entregaTipo, descricao, imagem, credenciaisTexto } = req.body;
  let novasCreds = credenciaisTexto ? credenciaisTexto.split('\n').map(c => c.trim()).filter(Boolean) : [];

  if (id) {
    const prod = produtos.find(p => p.id == id);
    if (prod) {
      prod.nome = nome;
      prod.preco = parseFloat(preco);
      prod.categoria = categoria;
      prod.entregaTipo = entregaTipo;
      prod.descricao = descricao;
      if (imagem) prod.imagem = imagem;
      if (novasCreds.length > 0) {
        prod.credenciais.push(...novasCreds);
        prod.estoque = prod.credenciais.length;
      }
    }
  } else {
    const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
    produtos.push({
      id: novoId,
      nome,
      preco: parseFloat(preco),
      categoria,
      entregaTipo,
      descricao,
      imagem: imagem || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
      estoque: novasCreds.length,
      credenciais: novasCreds
    });
  }
  res.json({ success: true });
});

app.delete('/api/admin/produtos/:id', (req, res) => {
  produtos = produtos.filter(p => p.id != req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({ produtos });
});

app.post('/api/pagamento/pix', async (req, res) => {
  const { produtoId } = req.body;
  const prod = produtos.find(p => p.id == produtoId);
  if (!prod || prod.estoque <= 0) return res.status(400).json({ success: false, error: "Produto indisponível ou esgotado." });

  try {
    const payment = new Payment(client);
    const body = {
      transaction_amount: prod.preco,
      description: `Compra: ${prod.nome}`,
      payment_method_id: 'pix',
      payer: { email: 'cliente@donstore.com' }
    };
    const response = await payment.create({ body });
    res.json({
      success: true,
      paymentId: response.id,
      qrCodeText: response.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (error) {
    // Simulação caso o token do MP seja de teste/inválido
    res.json({
      success: true,
      paymentId: "simulado_" + Date.now(),
      qrCodeText: "00020126580014br.gov.bcb.pix...",
      qrCodeBase64: null
    });
  }
});

app.post('/api/pagamento/verificar', (req, res) => {
  const { paymentId, produtoId } = req.body;
  const prod = produtos.find(p => p.id == produtoId);
  if (prod && prod.credenciais.length > 0) {
    const dadoEntregue = prod.credenciais.shift();
    prod.estoque = prod.credenciais.length;
    return res.json({ success: true, status: 'APPROVED', dadoEntregue });
  }
  res.json({ success: true, status: 'APPROVED', dadoEntregue: "Acesso liberado com sucesso!" });
});

app.get('/produto.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'produto.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

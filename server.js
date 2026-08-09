import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'dados.json');

// Configuração oficial do Mercado Pago com o seu Token
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-249848378901175-080605-e67c3c2b3575d5a687864a126913a7ae-3171236437' 
});

const produtosIniciais = [
  {
    id: 1,
    nome: "TELA NETFLIX 4K",
    descricao: "Acesso em Tela 4K Ultra HD com suporte.",
    preco: 12.00,
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
    nome: "TELA DISNEY+",
    descricao: "Conta completa Disney+ com suporte garantido.",
    preco: 10.00,
    categoria: "Streaming",
    entregaTipo: "EMAIL",
    imagem: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=500&auto=format&fit=crop",
    credenciais: [
      "disney1@donstore.com:senha789"
    ]
  },
  {
    id: 3,
    nome: "HISTORICO ESCOLAR",
    descricao: "Documento escolar completo e formatado. Finalizado via WhatsApp.",
    preco: 120.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 4,
    nome: "CERTIFICADO ESCOLAR",
    descricao: "Certificado escolar emitido sob demanda. Finalizado via WhatsApp.",
    preco: 100.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 5,
    nome: "ESQUEMA SMARTFIT",
    descricao: "Acesso liberado ao plano Smart Fit via esquema.",
    preco: 40.00,
    categoria: "Serviços",
    entregaTipo: "EMAIL",
    imagem: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
    credenciais: [
      "smartfit_token_01:valido2026"
    ]
  },
  {
    id: 6,
    nome: "RG DIGITAL",
    descricao: "Emissão de RG digital com agilidade. Finalizado via WhatsApp.",
    preco: 100.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 7,
    nome: "CNH DIGITAL",
    descricao: "Regularização e liberação de CNH digital. Finalizado via WhatsApp.",
    preco: 140.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 8,
    nome: "COMPROVANTE DE RESIDENCIA",
    descricao: "Comprovante de residência válido. Finalizado via WhatsApp.",
    preco: 30.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 9,
    nome: "ATESTADO MEDICO",
    descricao: "Atestado médico padronizado. Finalizado via WhatsApp.",
    preco: 40.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 10,
    nome: "99 MOTORISTA",
    descricao: "Ativação e cadastro para motorista 99. Finalizado via WhatsApp.",
    preco: 230.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=500&auto=format&fit=crop",
    credenciais: []
  },
  {
    id: 11,
    nome: "UBER MOTORISTA",
    descricao: "Ativação e liberação para conta Uber Motorista. Finalizado via WhatsApp.",
    preco: 330.00,
    categoria: "Serviços",
    entregaTipo: "WHATSAPP",
    imagem: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
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

// Integração Real com Mercado Pago para Gerar Pix
app.post('/api/pagamento/pix', async (req, res) => {
  const { produtoId, emailCliente } = req.body;
  const db = carregarBanco();
  const produto = db.produtos.find(p => p.id === produtoId);

  if (!produto) return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
  if (produto.entregaTipo !== 'EMAIL') {
    return res.status(400).json({ success: false, error: 'Este produto não utiliza entrega automática por Pix.' });
  }
  if (!produto.credenciais || produto.credenciais.length === 0) {
    return res.status(400).json({ success: false, error: 'Produto esgotado.' });
  }

  try {
    const payment = new Payment(client);
    const body = {
      transaction_amount: Number(produto.preco),
      description: `Compra: ${produto.nome}`,
      payment_method_id: 'pix',
      payer: {
        email: emailCliente || 'cliente@donstore.com',
        first_name: 'Cliente',
        last_name: 'DonStore'
      }
    };

    const response = await payment.create({ body });

    res.json({
      success: true,
      paymentId: response.id,
      qrCodeText: response.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64,
      valor: produto.preco,
      status: response.status
    });
  } catch (error) {
    console.error('Erro ao gerar Pix no Mercado Pago:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar pagamento Pix na API.' });
  }
});

// Verificação de Status do Pagamento na API do Mercado Pago + Entrega Automática
app.post('/api/pagamento/verificar', async (req, res) => {
  const { paymentId, produtoId } = req.body;
  const db = carregarBanco();
  const produto = db.produtos.find(p => p.id === produtoId);

  if (!produto) return res.status(404).json({ success: false, error: 'Produto não encontrado.' });

  try {
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    if (response.status === 'approved') {
      if (!produto.credenciais || produto.credenciais.length === 0) {
        return res.status(400).json({ success: false, error: 'Pagamento aprovado, mas o produto esgotou no estoque!' });
      }

      const dadoEntregue = produto.credenciais.shift();
      salvarBanco(db);

      return res.json({
        success: true,
        status: 'APPROVED',
        dadoEntregue
      });
    } else {
      return res.json({
        success: true,
        status: response.status.toUpperCase(), // PENDING, REJECTED, etc.
        dadoEntregue: null
      });
    }
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ success: false, error: 'Erro ao consultar status do pagamento.' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const db = carregarBanco();
  res.json({ produtos: db.produtos });
});

// Rota de Administração (Adicionar e Editar Produtos)
app.post('/api/admin/produtos', (req, res) => {
  const { id, nome, preco, categoria, entregaTipo, descricao, imagem, credenciaisTexto } = req.body;
  const db = carregarBanco();

  let credenciaisArray = [];
  if (credenciaisTexto && credenciaisTexto.trim() !== '') {
    credenciaisArray = credenciaisTexto.split('\n').map(c => c.trim()).filter(c => c !== '');
  }

  if (id) {
    // Editar produto existente
    const index = db.produtos.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      db.produtos[index] = {
        ...db.produtos[index],
        nome,
        preco: parseFloat(preco),
        categoria,
        entregaTipo: entregaTipo || 'WHATSAPP',
        descricao: descricao || '',
        imagem: imagem || db.produtos[index].imagem,
        credenciais: credenciaisArray.length > 0 ? credenciaisArray : db.produtos[index].credenciais
      };
    }
  } else {
    // Criar novo produto
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
  }

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

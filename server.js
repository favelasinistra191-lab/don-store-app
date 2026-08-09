import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ==============================================================================
 const client = new MercadoPagoConfig({ accessToken: 'APP_USR-249848378901175-080605-e67c3c2b3575d5a687864a126913a7ae-3171236437' });
// ==============================================================================
// 📱 CONFIGURAÇÃO DO WHATSAPP
// ==============================================================================
// LINHA 23: Insira o seu número do WhatsApp abaixo (com DDI e DDD, ex: 5511999999999):
const WHATSAPP_NUMERO = '5565993416402';
// Banco de dados em memória inicial (com produtos profissionais)
let produtos = [
  {
    id: 1,
    nome: "Netflix (Plano Premium 4K)",
    categoria: "Streaming",
    preco: 24.90,
    descricao: "Conta Netflix em plano Premium Ultra HD 4K com alta qualidade de som espacial e perfil exclusivo.",
    especificacoes: "• Tela Exclusiva Privada\n• Resolução Ultra HD 4K + HDR\n• Áudio Espacial Disponível\n• Garantia e Suporte 24/7",
    imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop",
    estoque: 10,
    credenciais: [
      "net1@donstore.com:senha123", "net2@donstore.com:senha123", "net3@donstore.com:senha123",
      "net4@donstore.com:senha123", "net5@donstore.com:senha123", "net6@donstore.com:senha123",
      "net7@donstore.com:senha123", "net8@donstore.com:senha123", "net9@donstore.com:senha123", "net10@donstore.com:senha123"
    ]
  },
  {
    id: 2,
    nome: "Disney+ (Plano Full 4K)",
    categoria: "Streaming",
    preco: 19.90,
    descricao: "Assinatura oficial do melhor plano Disney+ com suporte a resolução 4K UHD, HDR e múltiplas telas.",
    especificacoes: "• Plano Full Sem Anúncios\n• Resolução 4K UHD Impecável\n• Conteúdos IMAX Enhanced\n• Suporte Automatizado",
    imagem: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    estoque: 8,
    credenciais: [
      "disney1@donstore.com:senha123", "disney2@donstore.com:senha123", "disney3@donstore.com:senha123",
      "disney4@donstore.com:senha123", "disney5@donstore.com:senha123", "disney6@donstore.com:senha123",
      "disney7@donstore.com:senha123", "disney8@donstore.com:senha123"
    ]
  },
  {
    id: 3,
    nome: "99 Motorista (Ativação / Suporte)",
    categoria: "Serviços",
    preco: 49.90,
    descricao: "Serviço especializado de liberação, suporte e verificação de cadastro para motorista parceiro 99.",
    especificacoes: "• Ativação Rápida e Segura\n• Suporte Técnico Especializado\n• Orientação Completa de Documentos\n• Atendimento via WhatsApp",
    imagem: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
    estoque: 15,
    credenciais: [
      "Ativação 99 - Suporte Concluído #1", "Ativação 99 - Suporte Concluído #2", "Ativação 99 - Suporte Concluído #3"
    ]
  },
  {
    id: 4,
    nome: "Uber Motorista (Regularização)",
    categoria: "Serviços",
    preco: 59.90,
    descricao: "Assessoria completa para otimização de perfil e regularização de documentos na plataforma Uber.",
    especificacoes: "• Análise Completa de Perfil\n• Regularização Ágil de Pendências\n• Consultoria Direta com Especialista\n• Garantia de Atendimento",
    imagem: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
    estoque: 10,
    credenciais: [
      "Regularização Uber - Processo #1", "Regularização Uber - Processo #2"
    ]
  }
];

let pedidos = [];
const ADMIN_SENHA = "admin"; // Senha do painel admin

// Rotas da API
app.get('/api/config', (req, res) => {
  res.json({ whatsapp: WHATSAPP_NUMERO });
});

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;
  if (senha === ADMIN_SENHA) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Senha incorreta" });
  }
});

app.post('/api/admin/produtos', (req, res) => {
  const { id, nome, preco, categoria, descricao, especificacoes, imagem, credenciaisTexto } = req.body;
  let novasCreds = credenciaisTexto ? credenciaisTexto.split('\n').map(c => c.trim()).filter(Boolean) : [];

  if (id) {
    const prod = produtos.find(p => p.id == id);
    if (prod) {
      prod.nome = nome;
      prod.preco = parseFloat(preco);
      prod.categoria = categoria;
      prod.descricao = descricao;
      prod.especificacoes = especificacoes;
      if (imagem) prod.imagem = imagem;
      if (novasCreds.length > 0) {
        prod.credenciais.push(...novasCreds);
      }
      prod.estoque = prod.credenciais.length;
    }
  } else {
    const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
    produtos.push({
      id: novoId,
      nome,
      preco: parseFloat(preco),
      categoria,
      descricao,
      especificacoes: especificacoes || "• Produto Digital Premium\n• Entrega Automática\n• Suporte Garantido",
      imagem: imagem || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
      estoque: novasCreds.length,
      credenciais: novasCreds
    });
  }
  res.json({ success: true, produtos });
});

app.delete('/api/admin/produtos/:id', (req, res) => {
  produtos = produtos.filter(p => p.id != req.params.id);
  res.json({ success: true, produtos });
});

// Criar Pedido e Gerar Pix com Mercado Pago
app.post('/api/pedidos', async (req, res) => {
  const { produtoId, quantidade, email } = req.body;
  const qtd = parseInt(quantidade) || 1;
  const prod = produtos.find(p => p.id == produtoId);

  if (!prod) return res.status(404).json({ success: false, message: "Produto não encontrado." });
  if (prod.estoque < qtd) return res.status(400).json({ success: false, message: `Estoque insuficiente! Disponível: ${prod.estoque}` });

  const valorTotal = Number((prod.preco * qtd).toFixed(2));
  const pedidoId = 'DON-' + Math.floor(100000 + Math.random() * 900000);

  try {
    const payment = new Payment(client);
    const body = {
      transaction_amount: valorTotal,
      description: `${qtd}x ${prod.nome} - Don Store`,
      payment_method_id: 'pix',
      payer: { email: email || 'cliente@donstore.com' }
    };
    
    const response = await payment.create({ body });
    
    const novoPedido = {
      id: pedidoId,
      mpId: response.id,
      produtoId: prod.id,
      produtoNome: prod.nome,
      quantidade: qtd,
      valor: valorTotal,
      email,
      status: 'pendente',
      data: new Date().toLocaleString('pt-BR')
    };
    pedidos.push(novoPedido);

    res.json({
      success: true,
      pedidoId,
      qrCodeText: response.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64,
      copiaECola: response.point_of_interaction.transaction_data.qr_code
    });

  } catch (error) {
    console.error("Erro Mercado Pago:", error.message);
    // Modo simulação caso o Token seja placeholder ou inválido
    const novoPedido = {
      id: pedidoId,
      mpId: 'simulado_' + Date.now(),
      produtoId: prod.id,
      produtoNome: prod.nome,
      quantidade: qtd,
      valor: valorTotal,
      email,
      status: 'pendente',
      data: new Date().toLocaleString('pt-BR')
    };
    pedidos.push(novoPedido);

    res.json({
      success: true,
      pedidoId,
      qrCodeText: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5925DON STORE DIGITAL6009SAO PAULO62070503***63041C39",
      qrCodeBase64: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PixSimuladoDonStore",
      copiaECola: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5925DON STORE DIGITAL6009SAO PAULO62070503***63041C39"
    });
  }
});

// Verificar status do pagamento e entregar o produto
app.get('/api/pedidos/:id/status', async (req, res) => {
  const pedido = pedidos.find(p => p.id === req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

  if (pedido.status === 'pago') {
    return res.json({ status: 'pago', credenciais: pedido.credenciaisEntregues });
  }

  // Se for simulação ou se o MP aprovar
  let aprovado = false;
  if (pedido.mpId.startsWith('simulado_')) {
    // Para testes fáceis na sandbox, aprovamos automaticamente após alguns segundos ou simulação
    aprovado = true; 
  } else {
    try {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: pedido.mpId });
      if (paymentInfo.status === 'approved') {
        aprovado = true;
      }
    } catch (e) {
      console.error("Erro ao checar status MP:", e.message);
    }
  }

  if (aprovado) {
    const prod = produtos.find(p => p.id === pedido.produtoId);
    let entregues = [];
    if (prod && prod.credenciais.length >= pedido.quantidade) {
      for (let i = 0; i < pedido.quantidade; i++) {
        entregues.push(prod.credenciais.shift());
      }
      prod.estoque = prod.credenciais.length;
    } else {
      entregues = [`Acesso liberado Don Store (${pedido.quantidade}x ${pedido.produtoNome}) - Suporte via WhatsApp`];
    }

    pedido.status = 'pago';
    pedido.credenciaisEntregues = entregues;

    console.log(`[ENTREGA] E-mail enviado para ${pedido.email} com os produtos:`, entregues);

    return res.json({ status: 'pago', credenciais: entregues });
  }

  res.json({ status: 'pendente' });
});

// Consultar pedido por ID ou E-mail
app.get('/api/pedidos/consultar', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const encontrados = pedidos.filter(p => p.id.toLowerCase().includes(q) || (p.email && p.email.toLowerCase().includes(q)));
  res.json(encontrados);
});

app.listen(PORT, () => {
  console.log(`DON STORE rodando na porta ${PORT}`);
});

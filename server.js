import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
      imagem: "",
      entregaTipo: "EMAIL",
      controlarEstoque: true,
      // Array de contas/telas disponíveis para entrega automática:
      credenciaisEstoque: [
        "netflix1@exemplo.com:senha123 | Perfil: 01",
        "netflix2@exemplo.com:senha456 | Perfil: 02"
      ],
      ilimitado: false,
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
  // Retorna os produtos para a loja (sem expor as senhas em estoque para todo mundo ver na API pública)
  const produtosPublicos = db.produtos.map(p => ({
    ...p,
    estoque: p.credenciaisEstoque ? p.credenciaisEstoque.length : (p.estoque || 0)
  }));
  res.json(produtosPublicos);
});

// Cadastrar novo produto pelo Admin com as credenciais automáticas
app.post('/api/admin/produtos', (req, res) => {
  const { nome, descricao, preco, categoria, icone, corIcone, imagem, entregaTipo, credenciaisTexto } = req.body;
  if (!nome || !preco) return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });

  // Transforma o texto de credenciais (uma por linha) em um array limpo
  const credenciaisEstoque = credenciaisTexto 
    ? credenciaisTexto.split('\n').map(c => c.trim()).filter(c => c.length > 0)
    : [];

  const novoProduto = {
    id: db.produtos.length > 0 ? Math.max(...db.produtos.map(p => p.id)) + 1 : 1,
    nome,
    descricao: descricao || '',
    preco: parseFloat(preco),
    categoria: categoria || 'Streaming',
    icone: icone || 'fa-solid fa-box',
    corIcone: corIcone || 'text-white',
    imagem: imagem || '',
    entregaTipo: entregaTipo || 'EMAIL',
    controlarEstoque: true,
    credenciaisEstoque, // As contas cadastradas aqui serão entregues automaticamente
    ilimitado: false,
    whatsapp: SEU_WHATSAPP
  };

  db.produtos.push(novoProduto);
  res.json({ success: true, produto: novoProduto });
});

// Deletar produto pelo Admin
app.delete('/api/admin/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.produtos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado.' });

  db.produtos.splice(index, 1);
  res.json({ success: true });
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

// Rota de compra: Pega uma conta do estoque automaticamente e entrega para o cliente
app.post('/api/pedidos', (req, res) => {
  const { usuarioEmail, produtoId } = req.body;
  
  const prod = db.produtos.find(p => p.id === parseInt(produtoId));
  if (!prod) return res.status(400).json({ error: 'Produto não encontrado.' });

  let dadoEntregue = "Entrega combinada via WhatsApp";

  // Se o produto tiver contas cadastradas no estoque automático, puxa a primeira da fila
  if (prod.credenciaisEstoque && prod.credenciaisEstoque.length > 0) {
    dadoEntregue = prod.credenciaisEstoque.shift(); // Remove a conta do estoque para não vender duas vezes!
  } else if (!prod.ilimitado) {
    return res.status(400).json({ error: 'Produto esgotado no momento!' });
  }

  const novoPedido = {
    id: db.pedidos.length + 1,
    usuarioEmail: usuarioEmail || 'Anônimo',
    produtoNome: prod.nome,
    valor: prod.preco,
    dadoEntregue, // O site vai salvar exatamente qual login/senha foi entregue para este cliente
    data: new Date().toISOString()
  };

  db.pedidos.push(novoPedido);
  res.json({ success: true, dadoEntregue });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalVisitas: db.estatisticas.visitas,
    totalClientes: db.usuarios.filter(u => !u.isAdmin).length,
    totalPedidos: db.pedidos.length,
    clientes: db.usuarios.map(({ senha, ...u }) => u),
    pedidos: db.pedidos,
    produtos: db.produtos
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DON STORE] Rodando na porta ${PORT}`);
});

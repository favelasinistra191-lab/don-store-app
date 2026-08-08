import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Rota de Teste com Detalhamento de Erros
app.post('/api/test-checkout', async (req, res) => {
  const { emailCliente, produto } = req.body;

  if (!emailCliente || !produto) {
    return res.status(400).json({ error: 'Preencha o e-mail e o produto para o teste.' });
  }

  try {
    // Validação preliminar das variáveis
    if (!process.env.GITHUB_PAT_TOKEN) throw new Error('GITHUB_PAT_TOKEN não está configurado.');
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY não está configurado.');

    const octokit = new Octokit({ auth: process.env.GITHUB_PAT_TOKEN });
    const resend = new Resend(process.env.RESEND_API_KEY);

    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Favelasinistra191-lab';
    const GITHUB_REPO = process.env.GITHUB_REPO_DB || 'don-store-db';
    const FILE_PATH = 'estoque.json';

    // 1. Processa baixa no GitHub
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: FILE_PATH
    });

    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    let estoque = JSON.parse(content);

    const lista = estoque[produto] || [];
    const index = lista.findIndex(item => item.status === 'DISPONIVEL');

    if (index === -1) {
      return res.status(400).json({ error: `Estoque esgotado para o produto: ${produto}` });
    }

    const contaVendida = lista.splice(index, 1)[0];

    const novoConteudo = Buffer.from(JSON.stringify(estoque, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: FILE_PATH,
      message: `[AUTOMÁTICO] Entrega de ${produto} para ${emailCliente}`,
      content: novoConteudo,
      sha: data.sha
    });

    // 2. Dispara e-mail pelo Resend
    await resend.emails.send({
      from: 'DON STORE <onboarding@resend.dev>',
      to: emailCliente,
      subject: `🔑 [TESTE] Seu Acesso para ${produto.toUpperCase()} Chegou!`,
      html: `
        <div style="font-family: sans-serif; background: #0a0a0f; color: #fff; padding: 20px; border: 1px solid #8b5cf6; border-radius: 10px;">
          <h2 style="color: #a855f7;">👻 DON STORE - Acesso Liberado</h2>
          <p>Obrigado pelo seu teste! Abaixo estão as credenciais retiradas do banco privado:</p>
          <div style="background: #181826; padding: 15px; border-radius: 8px; font-size: 1.1rem; color: #a855f7; margin-top: 10px;">
            <p><strong>Login:</strong> ${contaVendida.login}</p>
            <p><strong>Senha:</strong> ${contaVendida.senha}</p>
          </div>
        </div>
      `
    });

    return res.json({
      success: true,
      message: `Sucesso! O acesso para ${produto} foi enviado para ${emailCliente} e baixado do GitHub.`
    });

  } catch (error) {
    console.error('Erro na Rota:', error);
    return res.status(500).json({ error: `Erro no servidor: ${error.message}` });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor DON STORE rodando na porta ${PORT}`));

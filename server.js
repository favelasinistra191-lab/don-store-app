import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Instâncias
const octokit = new Octokit({ auth: process.env.GITHUB_PAT_TOKEN });
const resend = new Resend(process.env.RESEND_API_KEY);

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO_DB || 'don-store-db';
const FILE_PATH = 'estoque.json';

// =======================================================
// ROTA DE TESTE GRÁTIS (SIMULAÇÃO DE PAGAMENTO)
// =======================================================
app.post('/api/test-checkout', async (req, res) => {
  const { emailCliente, produto } = req.body;

  if (!emailCliente || !produto) {
    return res.status(400).json({ error: 'Preencha o e-mail e o produto para o teste.' });
  }

  try {
    // 1. Envia E-mail de Confirmação do Pagamento (Simulado)
    await resend.emails.send({
      from: 'DON STORE <onboarding@resend.dev>',
      to: emailCliente,
      subject: '✅ [TESTE] Pagamento Aprovado com Sucesso! - DON STORE',
      html: `
        <div style="font-family: sans-serif; background: #0a0a0f; color: #fff; padding: 20px;">
          <h2 style="color: #a855f7;">👻 DON STORE (Modo de Teste)</h2>
          <p>Seu pagamento para o produto <strong>${produto.toUpperCase()}</strong> foi confirmado pelo sistema!</p>
          <p>O seu acesso está sendo separado no estoque do GitHub e será enviado no próximo e-mail.</p>
        </div>
      `
    });

    // 2. Processa a Baixa Automática no GitHub Privado
    const contaEntregue = await processarBaixaEstoque(produto, emailCliente);

    // 3. Envia E-mail com o Acesso (Login e Senha do GitHub)
    await resend.emails.send({
      from: 'DON STORE <onboarding@resend.dev>',
      to: emailCliente,
      subject: `🔑 [TESTE] Seu Acesso para ${produto.toUpperCase()} Chegou!`,
      html: `
        <div style="font-family: sans-serif; background: #0a0a0f; color: #fff; padding: 20px; border: 1px solid #8b5cf6;">
          <h2 style="color: #a855f7;">👻 DON STORE - Acesso Liberado</h2>
          <p>Aqui estão os dados da conta que foi removida do seu estoque privado:</p>
          <div style="background: #181826; padding: 15px; border-radius: 8px; font-size: 1.1rem; color: #a855f7;">
            <p><strong>Login:</strong> ${contaEntregue.login}</p>
            <p><strong>Senha:</strong> ${contaEntregue.senha}</p>
          </div>
        </div>
      `
    });

    return res.json({
      success: true,
      message: 'Teste executado com sucesso! Verifique sua caixa de entrada e o GitHub Privado.'
    });

  } catch (error) {
    console.error('Erro no Teste:', error);
    return res.status(500).json({ error: error.message });
  }
});

// FUNÇÃO PRIVADA QUE ATUALIZA O ESTOQUE NO GITHUB PRIVADO
async function processarBaixaEstoque(produto, emailCliente) {
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
    throw new Error(`Estoque esgotado para o produto: ${produto}`);
  }

  // Remove a conta da lista
  const contaVendida = lista.splice(index, 1)[0];

  // Grava o novo JSON no GitHub Privado
  const novoConteudo = Buffer.from(JSON.stringify(estoque, null, 2)).toString('base64');
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: FILE_PATH,
    message: `[AUTOMÁTICO] Entrega de ${produto} para ${emailCliente}`,
    content: novoConteudo,
    sha: data.sha
  });

  return contaVendida;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor DON STORE rodando na porta ${PORT}`));

const EMAIL_ADMIN = 'admin@loja.com'; // Credencial estática de administrador

// ==========================================
// 1. SIMULADOR DE BANCO DE DADOS RELACIONAL
// ==========================================
const MockDB = {
    // Simula: CREATE TABLE IF NOT EXISTS
    obterTabela: (nomeTabela) => {
        return JSON.parse(localStorage.getItem(`db_${nomeTabela}`)) || [];
    },
   
    // Motor interno de persistência
    salvarTabela: (nomeTabela, dados) => {
        localStorage.setItem(`db_${nomeTabela}`, JSON.stringify(dados));
    },

    // Simula: INSERT INTO tabela VALUES (...)
    inserir: (nomeTabela, registro) => {
        const tabela = MockDB.obterTabela(nomeTabela);
        // Gera um ID único simulando UUID do banco
        registro.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        tabela.push(registro);
        MockDB.salvarTabela(nomeTabela, tabela);
        return registro;
    },

    // Simula: SELECT * FROM tabela WHERE filtro
    selecionar: (nomeTabela, filtroCallback = null) => {
        const tabela = MockDB.obterTabela(nomeTabela);
        if (!filtroCallback) return tabela;
        return tabela.filter(filtroCallback);
    }
};

// ==========================================
// 2. AUTENTICAÇÃO SIMULADA
// ==========================================
function verificarSessao() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const linkLogin = document.getElementById('link-login');
    const linkAdmin = document.getElementById('link-admin');
    const btnSair = document.getElementById('btn-sair');

    if (usuarioLogado) {
        if(linkLogin) linkLogin.style.display = 'none';
        if(btnSair) btnSair.style.display = 'inline-block';
        if (linkAdmin && usuarioLogado.email === EMAIL_ADMIN) {
            linkAdmin.style.display = 'inline-block';
        }
    }
}

function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// ==========================================
// 3. CARRINHO DE COMPRAS
// ==========================================
let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const link = document.getElementById('link-carrinho');
    if(link) link.textContent = `Carrinho (${totalItens})`;
}

function adicionarAoCarrinho(id, descricao, preco, medida, imagem_url) {
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, descricao, preco, medida, imagem_url, quantidade: 1 });
    }
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    alert('Produto adicionado ao carrinho!');
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    atualizarContadorCarrinho();
});

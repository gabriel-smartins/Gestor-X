describe('Jornada Completa do Administrador no Sistema', () => {

  beforeEach(() => {
    // Reseta o banco de dados para um estado limpo antes de cada teste
    cy.request('POST', 'http://localhost:5000/api/testing/reset-database').then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Banco de dados resetado com sucesso via API.');
    });
  });

  it('deve executar o fluxo completo com reset e screenshots detalhados', () => {
    
    // --- FASE 1: LOGIN ---
    cy.visit('/login');
    cy.screenshot('01-TelaDeLogin');
    
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.screenshot('02-FormularioLogin_Preenchido');
    
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');
    cy.screenshot('03-DashboardInicial');

    // --- FASE 2: GERENCIANDO CATEGORIAS ---
    const rand = Math.floor(Math.random() * 1000);
    const nomeCategoria = `Categoria da Jornada ${rand}`;
    
    cy.contains('a', 'Categorias').click();
    cy.url().should('include', '/categories');

    cy.get('[placeholder="Insira o nome da categoria"]').type(nomeCategoria);
    cy.screenshot('04-FormularioCategoria_Preenchido');
    cy.contains('button', 'Adicionar Categoria').click();
    cy.get('table').should('contain', nomeCategoria);
    cy.screenshot('05-TabelaCategorias_AposAdicao');

    // --- FASE 3: GERENCIANDO FORNECEDORES ---
    const nomeFornecedor = `Fornecedor da Jornada ${rand}`;
    const emailFornecedor = `jornada-${rand}@fornecedor.com`;
    cy.contains('a', 'Fornecedores').click();
    cy.url().should('include', '/supplier');

    cy.contains('button', '+ Novo Fornecedor').click();
    cy.contains('h2', 'Adicionar novo fornecedor').parent().parent().within(() => {
        cy.get('[placeholder="Nome do fornecedor"]').type(nomeFornecedor);
        cy.get('[placeholder="Email do fornecedor"]').type(emailFornecedor);
        cy.screenshot('06-ModalFornecedor_Preenchido');
        cy.contains('button', 'Adicionar fornecedor').click();
    });
    cy.get('table').should('contain', nomeFornecedor);
    cy.screenshot('07-TabelaFornecedores_AposAdicao');

    // --- FASE 4: GERENCIANDO PRODUTOS ---
    const nomeProduto = `Produto da Jornada ${rand}`;
    cy.contains('a', 'Produtos').click();
    cy.url().should('include', '/products');
    
    cy.contains('button', '+ Novo Produto').click();
    cy.contains('h2', 'Adicionar Produto').parent().parent().within(() => {
      cy.get('input[name="name"]').type(nomeProduto);
      cy.get('input[name="price"]').type('299.90');
      cy.get('input[name="stock"]').type('75');
      cy.get('select[name="category"]').select(nomeCategoria);
      cy.get('select[name="supplier"]').select(nomeFornecedor);
      cy.screenshot('08-ModalProduto_Preenchido');
      cy.contains('button', 'Adicionar Produto').click();
    });
    cy.get('table').should('contain', nomeProduto);
    cy.screenshot('09-TabelaProdutos_AposAdicao');

    // --- FASE 5: GERENCIANDO USUÁRIOS ---
    const nomeNovoUsuario = `Usuário da Jornada ${rand}`;
    const emailNovoUsuario = `jornada-user-${rand}@gestorx.com`;
    cy.contains('a', 'Usuários').click();
    cy.url().should('include', '/users');
    
    cy.get('[placeholder="Insira o nome"]').type(nomeNovoUsuario);
    cy.get('[placeholder="Insira o Email"]').type(emailNovoUsuario);
    cy.get('[placeholder="*******"]').type('senha-final');
    cy.get('select[name="role"]').select('user');
    cy.screenshot('10-FormularioUsuario_Preenchido');
    cy.contains('button', 'Adiconar usuário').click();
    cy.get('table').should('contain', nomeNovoUsuario);
    cy.screenshot('11-TabelaUsuarios_AposAdicao');
    
    // --- FASE 6: MUDANÇA DE SENHA E VALIDAÇÃO FINAL ---
    const novaSenhaAdmin = 'admin123';
    cy.contains('a', 'Perfil').click();
    cy.url().should('include', '/profile');

    cy.contains('button', 'Editar perfil').click();
    cy.get('input[name="password"]').type(novaSenhaAdmin);
    cy.screenshot('12-Perfil_NovaSenhaDigitada');
    cy.contains('button', 'Salvar').click();
    
    cy.get('a[href="/logout"]').click();
    cy.url().should('include', '/login');
    cy.screenshot('13-TelaLogin_AposLogout');

    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type(novaSenhaAdmin);
    cy.screenshot('14-FormularioLogin_ComNovaSenha');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');
    cy.contains('a', 'Início').should('be.visible');
    cy.screenshot('15-JornadaConcluidaComSucesso');
  });

});
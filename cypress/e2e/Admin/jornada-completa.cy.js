describe('Jornada Completa do Administrador no Sistema', () => {

  it('deve executar o fluxo completo de login, CRUDs, e alteração de perfil', () => {
    
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');
    cy.contains('a', 'Início').should('be.visible');

    cy.contains('a', 'Categorias').click();
    cy.url().should('include', '/categories');

    const rand = Math.floor(Math.random() * 1000);
    const categoriaParaEditar = `Design ${rand}`;
    const categoriaParaDeletar = `Marketing ${rand}`;
    
    cy.get('[placeholder="Insira o nome da categoria"]').type(categoriaParaEditar);
    cy.contains('button', 'Adicionar Categoria').click();
    cy.get('[placeholder="Insira o nome da categoria"]').type(categoriaParaDeletar);
    cy.contains('button', 'Adicionar Categoria').click();
    cy.get('table').should('contain', categoriaParaEditar).and('contain', categoriaParaDeletar);

    const nomeEditadoCategoria = `${categoriaParaEditar} (Editado)`;
    cy.contains('td', categoriaParaEditar).parent('tr').within(() => {
      cy.contains('button', 'Editar').click();
    });
    cy.get('[placeholder="Insira o nome da categoria"]').clear().type(nomeEditadoCategoria);
    cy.contains('button', 'Salvar').click();
    cy.contains('td', new RegExp(`^${categoriaParaEditar}$`)).should('not.exist');
    cy.contains('td', nomeEditadoCategoria).should('be.visible');

    cy.contains('td', categoriaParaDeletar).parent('tr').within(() => {
      cy.contains('button', 'Deletar').click();
    });
    cy.get('table').contains('td', categoriaParaDeletar).should('not.exist');

    const nomeFornecedor = `Fornecedor da Jornada ${rand}`;
    const emailFornecedor = `jornada-${rand}@fornecedor.com`;
    cy.contains('a', 'Fornecedores').click();
    cy.url().should('include', '/supplier');
    cy.contains('button', '+ Novo Fornecedor').click();
    cy.get('[placeholder="Nome do fornecedor"]').type(nomeFornecedor);
    cy.get('[placeholder="Email do fornecedor"]').type(emailFornecedor);
    cy.contains('button', 'Adicionar fornecedor').click();
    cy.get('table').should('contain', nomeFornecedor);

    const nomeProduto = `Produto da Jornada ${rand}`;
    cy.contains('a', 'Produtos').click();
    cy.url().should('include', '/products');
    
    cy.contains('button', '+ Novo Produto').click();
    cy.contains('h2', 'Adicionar Produto').parent().parent().within(() => {
      cy.get('input[name="name"]').type(nomeProduto);
      cy.get('input[name="price"]').type('299.90');
      cy.get('input[name="stock"]').type('75');
      cy.get('select[name="category"]').select(nomeEditadoCategoria);
      cy.get('select[name="supplier"]').select(nomeFornecedor);
      cy.contains('button', 'Adicionar Produto').click();
    });
    cy.get('table').should('contain', nomeProduto);

    const nomeEditadoProduto = `${nomeProduto} (Revisado)`;
    cy.contains('td', nomeProduto).parent('tr').within(() => {
      cy.contains('button', 'Editar').click();
    });
    cy.contains('h2', 'Editar Produto').parent().parent().within(() => {
        cy.get('input[name="name"]').clear().type(nomeEditadoProduto);
        cy.get('input[name="price"]').clear().type('349.90');
        cy.contains('button', 'Editar Produto').click();
    });
    cy.get('table').should('contain', nomeEditadoProduto);

    const nomeNovoUsuario = `Usuário da Jornada ${rand}`;
    const emailNovoUsuario = `jornada-user-${rand}@gestorx.com`;
    cy.contains('a', 'Usuários').click();
    cy.url().should('include', '/users');

    cy.get('[placeholder="Insira o nome"]').type(nomeNovoUsuario);
    cy.get('[placeholder="Insira o Email"]').type(emailNovoUsuario);
    cy.get('[placeholder="*******"]').type('senha-final');
    cy.get('select[name="role"]').select('user');
    cy.contains('button', 'Adiconar usuário').click();
    cy.get('table').should('contain', nomeNovoUsuario);
    
    const novaSenhaAdmin = `admin${rand}`;
    cy.contains('a', 'Perfil').click();
    cy.url().should('include', '/profile');

    cy.contains('button', 'Editar perfil').click();
    cy.get('input[name="password"]').type(novaSenhaAdmin);
    cy.contains('button', 'Salvar').click();
    
    cy.get('a[href="/logout"]').click();
    cy.url().should('include', '/login');

    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type(novaSenhaAdmin);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');
    cy.contains('a', 'Início').should('be.visible');
  });

});
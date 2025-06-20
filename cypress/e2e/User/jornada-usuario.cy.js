describe('Jornada Completa do Usuário Comum', () => {

  it('deve fazer login, criar um pedido, verificar, alterar a senha e validar', () => {
    
    // FASE 1: LOGIN INICIAL

    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('user1-teste@gestorx.com');
    cy.get('[placeholder="Digite sua senha"]').type('user1'); 
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/employee-dashboard');
    cy.get('[placeholder="Pesquisar produtos..."]').should('be.visible');

    // FASE 2: FAZER UM PEDIDO

    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(1).invoke('text').as('nomeDoProduto');
    });

    cy.get('table tbody tr').first().within(() => {
      cy.contains('button', 'Fazer Pedido').click();
    });

    cy.contains('h2', 'Fazer Pedido').should('be.visible');
    cy.get('input[type="number"]').clear().type('2');

    cy.on('window:alert', (textoDoAlerta) => {
      expect(textoDoAlerta).to.contains('Pedido realizado com sucesso');
    });
    cy.contains('button', 'Confirmar').click();
    cy.contains('h2', 'Fazer Pedido').should('not.exist');

    // FASE 3: VERIFICAR O PEDIDO CRIADO

    cy.get('@nomeDoProduto').then((nomeProdutoSalvo) => {
      cy.contains('a', 'Pedidos').click();
      cy.url().should('include', '/employee-dashboard/orders');
      cy.contains('h1', 'Minhas Reposições').should('be.visible');
      cy.get('table').contains('td', nomeProdutoSalvo).should('be.visible');
    });

    // FASE 4: ALTERAR A SENHA

    cy.contains('a', 'Perfil').click();
    cy.url().should('include', '/employee-dashboard/profile');
    cy.contains('h1', 'Perfil de usuário').should('be.visible');

    cy.contains('button', 'Editar perfil').click();
    const novaSenha = 'user1'; 
    cy.get('input[name="password"]').type(novaSenha);
    cy.contains('button', 'Salvar').click();
    cy.get('input[name="name"]').should('be.disabled');

    // FASE 5: LOGOUT E VALIDAR A NOVA SENHA

    cy.get('a[href="/logout"]').click();
    cy.url().should('include', '/login');

    cy.get('[placeholder="Digite seu email"]').type('user1-teste@gestorx.com');
    cy.get('[placeholder="Digite sua senha"]').type(novaSenha);
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/employee-dashboard'); 
    cy.contains('a', 'Início').should('be.visible');
  });

});
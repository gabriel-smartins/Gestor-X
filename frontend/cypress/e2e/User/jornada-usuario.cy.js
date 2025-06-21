describe('Jornada do Usuário Comum', () => {

  it('deve fazer login, criar um pedido, verificar, alterar a senha e validar', () => {
    
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('user1-teste@gestorx.com');
    cy.get('[placeholder="Digite sua senha"]').type('user1'); 
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/employee-dashboard');
    cy.get('[placeholder="Pesquisar produtos..."]').should('be.visible');

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

    cy.get('@nomeDoProduto').then((nomeProdutoSalvo) => {
      cy.contains('a', 'Pedidos').click();
      cy.url().should('include', '/employee-dashboard/orders');
      cy.contains('h1', 'Minhas Reposições').should('be.visible');
      cy.get('table').contains('td', nomeProdutoSalvo).should('be.visible');
    });

    cy.contains('a', 'Perfil').click();
    cy.url().should('include', '/employee-dashboard/profile');
    cy.contains('h1', 'Perfil de usuário').should('be.visible');

    cy.contains('button', 'Editar perfil').click();
    const novaSenha = 'user1'; 
    cy.get('input[name="password"]').type(novaSenha);
    cy.contains('button', 'Salvar').click();

    cy.get('input[name="name"]').should('be.disabled');

    cy.get('a[href="/logout"]').click();
    cy.url().should('include', '/login');

    cy.get('[placeholder="Digite seu email"]').type('user1-teste@gestorx.com');
    cy.get('[placeholder="Digite sua senha"]').type(novaSenha);
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/employee-dashboard'); 
    cy.get('[placeholder="Pesquisar produtos..."]').should('be.visible');
  });

});
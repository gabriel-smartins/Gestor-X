describe('Página de Perfil do Usuário', () => {

  it('deve permitir que o usuário edite suas informações, mude a senha e faça login com a nova senha', () => {

    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');

    cy.contains('a', 'Perfil').click();
    cy.url().should('include', '/profile'); 
    cy.contains('h1', 'Perfil de usuário').should('be.visible');

    cy.get('input[name="name"]').should('be.disabled');
    cy.contains('button', 'Editar perfil').click();
    cy.get('input[name="name"]').should('be.enabled');

    const novoEndereco = `Avenida Cypress, ${Math.floor(Math.random() * 1000)}`;
    const novaSenha = 'admin';

    cy.get('input[name="address"]').clear().type(novoEndereco);
    cy.get('input[name="password"]').type(novaSenha);
    cy.contains('button', 'Salvar').click();

    cy.get('input[name="name"]').should('be.disabled');
    cy.get('input[name="address"]').should('have.value', novoEndereco);

    cy.get('a[href="/logout"]').click();
    cy.url().should('include', '/login');

    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type(novaSenha);
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/admin-dashboard');
    
    cy.contains('a', 'Início').should('be.visible');
  });

});
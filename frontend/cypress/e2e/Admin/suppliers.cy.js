// frontend/cypress/e2e/suppliers.cy.js

describe('Jornada Completa na Página de Fornecedores', () => {

  it('deve fazer login, e depois adicionar, editar e deletar fornecedores', () => {
    
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');

    cy.visit('/admin-dashboard/supplier');
    cy.contains('h1', 'Gerenciar Fornecedores').should('be.visible');

    const rand = Math.floor(Math.random() * 1000);
    const fornecedorParaEditar_nome = `Logitech ${rand}`;
    const fornecedorParaEditar_email = `contato-edita-${rand}@logitech.com`;
    const fornecedorParaDeletar_nome = `Multilaser ${rand}`;
    const fornecedorParaDeletar_email = `contato-deleta-${rand}@multilaser.com`;

    cy.contains('button', '+ Novo Fornecedor').click();
    cy.get('[placeholder="Nome do fornecedor"]').type(fornecedorParaEditar_nome);
    cy.get('[placeholder="Email do fornecedor"]').type(fornecedorParaEditar_email);
    cy.contains('button', 'Adicionar fornecedor').click();

    cy.contains('button', '+ Novo Fornecedor').click();
    cy.get('[placeholder="Nome do fornecedor"]').type(fornecedorParaDeletar_nome);
    cy.get('[placeholder="Email do fornecedor"]').type(fornecedorParaDeletar_email);
    cy.contains('button', 'Adicionar fornecedor').click();

    cy.get('table').should('contain', fornecedorParaEditar_nome);
    cy.get('table').should('contain', fornecedorParaDeletar_nome);

    const nomeEditado = `${fornecedorParaEditar_nome} (Global)`;
    cy.contains('td', fornecedorParaEditar_nome).parent('tr').within(() => {
      cy.contains('button', 'Editar').click();
    });
    cy.get('input[name="name"]').clear().type(nomeEditado);
    cy.contains('button', 'Salvar').click();

    cy.contains('td', fornecedorParaDeletar_nome).parent('tr').within(() => {
      cy.contains('button', 'Deletar').click();
    });

    cy.get('table').contains('td', fornecedorParaDeletar_nome).should('not.exist');
    cy.get('table').contains('td', new RegExp(`^${fornecedorParaEditar_nome}$`)).should('not.exist');
    cy.get('table').contains('td', nomeEditado).should('be.visible');
  });

});
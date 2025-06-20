describe('Fluxo de Login do GESTOR-X', () => {

  // TESTE 2: Cenário de erro
  it('deve mostrar uma mensagem de erro para credenciais inválidas', () => {
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('usuario@errado.com');
    cy.get('[placeholder="Digite sua senha"]').type('senha-errada');
    cy.contains('button', 'Entrar').click();
    cy.get('.text-red-600').should('be.visible');

  });

  it('deve mostrar uma mensagem de erro para credenciais inválidas', () => {
  // TESTE 1: Cenário de Sucesso
    cy.visit('/login'); 
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');
  });
});
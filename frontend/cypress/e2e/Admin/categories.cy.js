describe('Jornada Completa do Administrador', () => {

  it('deve fazer login, e depois adicionar, editar e deletar categorias', () => {
    cy.visit('/login');
    
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();

    cy.url().should('include', '/admin-dashboard');

    cy.contains('a', 'Categorias').click(); 
    cy.url().should('include', '/admin-dashboard/categories');
    cy.contains('h1', 'Gerenciar Categorias').should('be.visible');

    const rand = Math.floor(Math.random() * 1000);
    const categoriaParaEditar = `Design Gráfico ${rand}`;
    const categoriaParaDeletar = `Recursos Humanos ${rand}`;

    cy.get('[placeholder="Insira o nome da categoria"]').type(categoriaParaEditar);
    cy.contains('button', 'Adicionar Categoria').click();

    cy.get('[placeholder="Insira o nome da categoria"]').type(categoriaParaDeletar);
    cy.contains('button', 'Adicionar Categoria').click();

    cy.get('table').should('contain', categoriaParaEditar);
    cy.get('table').should('contain', categoriaParaDeletar);

    const nomeEditado = `${categoriaParaEditar} (Moderno)`;

    cy.contains('td', categoriaParaEditar).parent('tr').within(() => {
      cy.contains('button', 'Editar').click();
    });

    cy.contains('h2', 'Editar Categoria').should('be.visible');
    cy.get('[placeholder="Insira o nome da categoria"]').clear().type(nomeEditado);
    cy.contains('button', 'Salvar').click();

    cy.contains('td', new RegExp(`^${categoriaParaEditar}$`)).should('not.exist');
    cy.get('table').contains('td', nomeEditado).should('be.visible');

    cy.contains('td', categoriaParaDeletar).parent('tr').within(() => {
      cy.contains('button', 'Deletar').click();
    });

    cy.get('table').contains('td', categoriaParaDeletar).should('not.exist');
    
    cy.get('table').contains('td', nomeEditado).should('be.visible');
  });
  
});
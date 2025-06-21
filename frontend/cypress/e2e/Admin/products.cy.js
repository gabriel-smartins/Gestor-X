describe('Gerenciamento de Produtos', () => {

  it('deve fazer login e depois adicionar, editar e deletar produtos', () => {
    
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');

    cy.visit('/admin-dashboard/products');
    cy.contains('h1', 'Produtos').should('be.visible');

    const rand = Math.floor(Math.random() * 1000);
    const produtoParaEditar = `Cadeira Gamer ${rand}`;
    const produtoParaDeletar = `Microfone Condensador ${rand}`;
    
    const categoriaExistente = 'Eletrônicos 725';
    const fornecedorExistente = 'Eletronicos S.A';

    cy.contains('button', '+ Novo Produto').click();
    cy.contains('h2', 'Adicionar Produto').parent().parent().within(() => {
      cy.get('input[name="name"]').type(produtoParaEditar);
      cy.get('input[name="price"]').type('1500');
      cy.get('input[name="stock"]').type('10');
      
      cy.get('select[name="category"]').should('contain', categoriaExistente);
      cy.get('select[name="category"]').select(categoriaExistente);
      
      cy.get('select[name="supplier"]').should('contain', fornecedorExistente);
      cy.get('select[name="supplier"]').select(fornecedorExistente);

      cy.contains('button', 'Adicionar Produto').click();
    });

    cy.contains('button', '+ Novo Produto').click();
    cy.contains('h2', 'Adicionar Produto').parent().parent().within(() => {
      cy.get('input[name="name"]').type(produtoParaDeletar);
      cy.get('input[name="price"]').type('450');
      cy.get('input[name="stock"]').type('50');

      cy.get('select[name="category"]').should('contain', categoriaExistente);
      cy.get('select[name="category"]').select(categoriaExistente);

      cy.get('select[name="supplier"]').should('contain', fornecedorExistente);
      cy.get('select[name="supplier"]').select(fornecedorExistente);

      cy.contains('button', 'Adicionar Produto').click();
    });

    cy.get('table').should('contain', produtoParaEditar).and('contain', produtoParaDeletar);
      
    const nomeEditado = `${produtoParaEditar} (Premium)`;
    cy.contains('td', produtoParaEditar).parent('tr').within(() => {
      cy.contains('button', 'Editar').click();
    });

    cy.contains('h2', 'Editar Produto').parent().parent().within(() => {
      cy.get('input[name="name"]').clear().type(nomeEditado);
      cy.contains('button', 'Editar Produto').click();
    });

    cy.contains('td', produtoParaDeletar).parent('tr').within(() => {
      cy.contains('button', 'Deletar').click();
    });

    cy.get('table').contains('td', produtoParaDeletar).should('not.exist');
    cy.contains('td', new RegExp(`^${produtoParaEditar}$`)).should('not.exist');
    cy.get('table').contains('td', nomeEditado).should('be.visible');
  });

});
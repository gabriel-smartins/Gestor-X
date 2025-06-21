describe('Gerenciamento de Usuários', () => {

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[placeholder="Digite seu email"]').type('admin@gmail.com');
    cy.get('[placeholder="Digite sua senha"]').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin-dashboard');

    cy.contains('a', 'Usuários').click();
    cy.url().should('include', '/users');
  });

  it('deve permitir adicionar um novo usuário Admin e um novo usuário comum', () => {
    const randAdmin = Math.floor(Math.random() * 1000);
    const adminName = `Novo Admin ${randAdmin}`;
    const adminEmail = `admin-teste-${randAdmin}@gestorx.com`;

    cy.log('Criando usuário Admin...');
    cy.get('[placeholder="Insira o nome"]').type(adminName);
    cy.get('[placeholder="Insira o Email"]').type(adminEmail);
    cy.get('[placeholder="*******"]').type('senha123');
    cy.get('[placeholder="Insira o endereço"]').type('Rua da Administração, 1');
    
    cy.get('select[name="role"]').select('admin');
    
    cy.contains('button', 'Adiconar usuário').click();

    cy.get('table').contains('td', adminName).should('be.visible');
    cy.contains('td', adminName)
      .parent('tr')
      .should('contain', 'admin');

    const randUser = Math.floor(Math.random() * 1000);
    const userName = `Colaborador ${randUser}`;
    const userEmail = `user-teste-${randUser}@gestorx.com`;

    cy.log('Criando usuário comum...');
    cy.get('[placeholder="Insira o nome"]').type(userName);
    cy.get('[placeholder="Insira o Email"]').type(userEmail);
    cy.get('[placeholder="*******"]').type('outrasenha456');
    cy.get('[placeholder="Insira o endereço"]').type('Avenida dos Colaboradores, 2');

    cy.get('select[name="role"]').select('user');

    cy.contains('button', 'Adiconar usuário').click();

    cy.get('table').contains('td', userName).should('be.visible');
    cy.contains('td', userName)
      .parent('tr')
      .should('contain', 'user');
  });

});
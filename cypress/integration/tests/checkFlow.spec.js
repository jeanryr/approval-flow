/// <reference types="cypress" />

const teams_data = [{"id":"TEAM1","name":"Marketing","users":["USR1","USR3"]},{"id":"TEAM2","name":"Product & Engineering","users":["USR2","USR3","USR7","USR8","USR9"]},{"id":"TEAM3","name":"Finance","users":["USR4","USR5"]},{"id":"TEAM4","name":"Sales","users":["USR10","USR11","USR12","USR13"]},{"id":"TEAM5","name":"Operations","users":["USR6","USR14"]}]

context('Check approval flow', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/',{
      onBeforeLoad (win) {
        cy.stub(win, 'fetch').withArgs('http://toto1234.zw/ok')
        .resolves({
          ok: true,
          json: () => teams_data,
        })
      },
    });
  })

  it('should have a list of 5 teams', () => {
    cy.get('[data-testid=team-list-name]').should('have.length', 5);
    cy.get('[data-testid=team-list-name]').eq(0).contains('Marketing');
    cy.get('[data-testid=team-list-name]').eq(1).contains('Product & Engineering');
    cy.get('[data-testid=team-list-name]').eq(2).contains('Finance');
    cy.get('[data-testid=team-list-name]').eq(3).contains('Sales');
    cy.get('[data-testid=team-list-name]').eq(4).contains('Operations');
  })

  it('should have a list of first users (at least one and max three) for each team', () => {
    cy.get('[data-testid=team-list-card]').each(($el) =>{
      cy.wrap($el).within(()=> {
        cy.get('[data-testid=user-from-list-name]').its('length').should('be.gt', 1);
        cy.get('[data-testid=user-from-list-name]').its('length').should('be.lt', 4);
      });
    });
  })
})
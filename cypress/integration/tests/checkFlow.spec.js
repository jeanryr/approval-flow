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

  it('should go to approval scheme component when clicking on a team', () => {
    const teamName = 'Marketing';
    cy.get('[data-testid=team-list-name]').contains(teamName).click();
    cy.get('[data-testid=selected-team-name]').contains(teamName);
  })

  it('should select an user and then the user does not appear twice', () => {
    const teamName = 'Marketing';
    cy.get('[data-testid=team-list-name]').contains(teamName).click();
    cy.get('select').eq(0).select('USR2').should('have.value', 'USR2');
    cy.get('select').eq(0).contains('Ralph Romero');
    cy.get('select').eq(1).contains('Ralph Romero').should('not.exist');
  });

  it('should change the amount `up To` of first step and we should see it updated in the `from` of the second step', () => {
    const teamName = 'Marketing';
    cy.get('[data-testid=team-list-name]').contains(teamName).click();
    cy.get('[data-testid=up-to-select]').clear().type(490);
    cy.get('[data-testid=from-to-elem]').eq(0).contains('From 490EUR')
  });

  it('should save locally changes when clicking on `Save approval flow` button', () => {
    const teamName = 'Marketing';
    cy.get('[data-testid=team-list-name]').contains(teamName).click();
    cy.get('[data-testid=up-to-select]').clear().type(423);
    cy.get('select').eq(0).select('USR1');
    cy.get('select').eq(1).select('USR3');
    cy.get('select').eq(2).select('USR7');
    cy.get('[data-testid=save-btn]').click().should(()=>{
      expect(localStorage.getItem('teams-approval-scheme')).to.eq('{"TEAM1":[{"from":0,"to":423,"user_id":"USR1"},{"from":423,"to":1000,"user_id":"USR3"},{"from":1000,"to":-1,"user_id":"USR7"}]}')
    });

    cy.get('[data-testid=team-list-name]').contains(teamName).click();
    cy.get('[data-testid=from-to-elem]').eq(0).contains('From 423EUR')
    cy.get('select').eq(0).should('have.value', 'USR1');
    cy.get('select').eq(1).should('have.value', 'USR3');
    cy.get('select').eq(2).should('have.value', 'USR7');

    cy.clearLocalStorage()
  });
})

/// <reference types="cypress" />

context('Check approval flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should be on homepage', () => {
    cy.get('[data-testid=homepage]').contains('Hello')
  })
})

# Approval Flow app

## How to run locally

In the project directory, you can run:

### `npm install`
and then
### `npm start`
Which runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to test

The tests are backendless tests with Cypress.
It's going to visit the local server, mock the API calls, and do some operartions and asserts on it.


So, first, run the local server with `npm start`
Then, run the cypress tests with `npm cypress:open`

## Technical documentation

### Architecture

I used React with TypeScriot and hooks.
I didn't use Redux because we only have 3 data structures. Since we don't have a lot of data, for now I prefered to just pass the needed values by props.



we just have two constant values from API (users and teams) and one object that represent the structure scheme (which is saved in local storage).


### Technical Flows

We have two main components: `TeamsList` and `ApprovalSetup`.

**If a team is not selected:**

We display `TeamsList`, it display team name and the first 3 users (+ first 3 approvals if there are).
For the 3 approvals we compute a map [teamId => Approval users] from the approvalScheme.

**If a team is selected:**

We display `ApprovalSetup`, if there is not any approval scheme for this team in the local storage we initialize one with default value (0-> 500, 500->100, 100);
On each modification we update the approval scheme state. We only save it in local storage when clicking on the save button.

If we modify the threshold: we check that it's in the corrct bounds (not inferior to the `to` of previous step and not superior to the `from` of the next step)

If we modify the user: we update it, remove this user from the available users and add previous user to the availble users.

If we add a threshold: we insert a new threshold where the Add button was located, new bounds will have the same from/to (`from` will be the `to` from the previous step, and `to` will be the `from` of the next step).

If we remove a threshold: we remove it from items and change the `to` of previous step and `from` of next step.


### Structures

We have 3 mains values :

* Teams (readonly and we get it from API)
* Users (readonly and we get it from API)
* TeamsApprovalScheme (read from local storage, write on state, and write on local storage if save button is clicked)

Everything is typed (types are in `./src/types.ts`)

## Didn't have time to do:

 * Add a debouncer when changing threshold so that it would be easier to add a value (e.g. let me have time to clear input and type my new value)
 * Nicer way to display warning message than in alert (when an approval scheme is wrong or that a threshold is not in the right bounds, for example having a notifications component would have been better)
 * Have better styling on buttons
 * Use contextApi to avoid a bit of props drilling from some components
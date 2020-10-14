import React, { useEffect, useState } from "react";
import "./App.css";
import { TeamsApprovalScheme, ApprovalSchemeItem, Team, User } from "./types";
import TeamsList from "./components/TeamsList";
import ApprovalSetup from "./components/ApprovalSetup";

const LOCAL_STORAGE_KEY = "teams-approval-scheme";

const teams_data = [
  { id: "TEAM1", name: "Marketing", users: ["USR1", "USR3"] },
  { id: "TEAM2", name: "Product & Engineering", users: ["USR2", "USR3", "USR7", "USR8", "USR9"] },
  { id: "TEAM3", name: "Finance", users: ["USR4", "USR5"] },
  { id: "TEAM4", name: "Sales", users: ["USR10", "USR11", "USR12", "USR13"] },
  { id: "TEAM5", name: "Operations", users: ["USR6", "USR14"] },
];
const users_data = [
  { id: "USR1", first_name: "Eugene", last_name: "Tran", email: "eugene.tran@spendesk.com" },
  { id: "USR2", first_name: "Ralph", last_name: "Romero", email: "ralph.romero@spendesk.com" },
  { id: "USR3", first_name: "Tiffany", last_name: "Frazier", email: "tiffany.frazier@spendesk.com" },
  { id: "USR4", first_name: "Sandra", last_name: "Reed", email: "sandra.reed@spendesk.com" },
  { id: "USR5", first_name: "Jason", last_name: "Casey", email: "jason.casey@spendesk.com" },
  { id: "USR6", first_name: "Stacy", last_name: "Smith", email: "stacy.smith@spendesk.com" },
  { id: "USR7", first_name: "Andy", last_name: "Bishop", email: "andy.bishop@spendesk.com" },
  { id: "USR8", first_name: "Henry", last_name: "Wallace", email: "henry.wallace@spendesk.com" },
  { id: "USR9", first_name: "Flora", last_name: "Flowers", email: "flora.flowers@spendesk.com" },
  { id: "USR10", first_name: "Michelle", last_name: "Stones", email: "michelle.stones@spendesk.com" },
  { id: "USR11", first_name: "Alexandra", last_name: "Goodman", email: "alexandra.goodman@spendesk.com" },
  { id: "USR12", first_name: "Olivia", last_name: "Bailey", email: "olivia.bailey@spendesk.com" },
  { id: "USR13", first_name: "Michael", last_name: "Shaw", email: "michael.show@spendesk.com" },
  { id: "USR14", first_name: "Peter", last_name: "Brady", email: "peter.brady@spendesk.com" },
  { id: "USR15", first_name: "David", last_name: "Blake", email: "david.blake@spendesk.com" },
];

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [approvalsByTeam, setApprovalsByTeam] = useState<{[teamId: string]: User[]}>();

  function checkIfCurrentApprovalSchemeIsOk(approvalSchemeItems: ApprovalSchemeItem[]) {
    for (let i = 0; i < approvalSchemeItems.length; i++) {
      if (!approvalSchemeItems[i].user_id || approvalSchemeItems[i].user_id === "") return false;
      if (i < approvalSchemeItems.length - 1 && approvalSchemeItems[i].to !== approvalSchemeItems[i + 1].from)
        return false;
    }
    return true;
  }

  function getApprovalSchemeFromLocalStorage(): TeamsApprovalScheme {
    const teamsApprovalScheme = localStorage.getItem(LOCAL_STORAGE_KEY);
    return teamsApprovalScheme ? JSON.parse(teamsApprovalScheme) : {};
  }

  function saveApprovalSchemeToLocalStorage(approvalSchemeItems: ApprovalSchemeItem[], selectedTeamId: string) {
    if (checkIfCurrentApprovalSchemeIsOk(approvalSchemeItems)) {
      const teamsApprovalScheme = getApprovalSchemeFromLocalStorage();
      teamsApprovalScheme[selectedTeamId] = approvalSchemeItems;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teamsApprovalScheme));
      setSelectedTeam(undefined);
    } else {
      alert("Something is wrong with your approval scheme, check that you have selected an user for each threshold");
    }
  }
  
  function setApprovalsForEachTeam(teamsApprovalScheme: TeamsApprovalScheme) {
    let newApprovalsByTeam: {[teamId: string]: User[]} = {};
    for (const [teamKey, value] of Object.entries(teamsApprovalScheme)) {
      newApprovalsByTeam[teamKey] = value.map(x=> getUser(x.user_id));
    }
    setApprovalsByTeam(newApprovalsByTeam);
  }

  useEffect(()=> {
    const approvalScheme = getApprovalSchemeFromLocalStorage();
    if (approvalScheme){
      setApprovalsForEachTeam(approvalScheme);
    }
  }, [users, teams, selectedTeam])

  useEffect(() => {
    async function getTeamsAndUsers() {
      setTeams(teams_data);
      setUsers(users_data);
    }
    getTeamsAndUsers();
  }, []);

  function getUser(userId: string): User {
    let userToFind = users.find((user) => user.id === userId);
    if (!userToFind) {
      userToFind = { id: "notfounduser", first_name: "Not", last_name: "Found", email: "notfound@user.com" };
    }
    return userToFind;
  }

  return (
    <div className="App">
      {selectedTeam ? (
        <ApprovalSetup
          selectedTeam={selectedTeam}
          getUser={getUser}
          getAllUsers={() => users}
          unSelectTeam={() => setSelectedTeam(undefined)}
          saveApprovalSchemeToLocalStorage={saveApprovalSchemeToLocalStorage}
          getApprovalSchemeFromLocalStorage={getApprovalSchemeFromLocalStorage}
        />
      ) : (
        <TeamsList teams={teams} getUser={getUser} selectTeam={setSelectedTeam} approvalsByTeam={approvalsByTeam ?? {}} />
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import "./App.css";
import { TeamsApprovalScheme, ApprovalSchemeItem, Team, User } from "./types";
import TeamsList from "./components/TeamsList";
import ApprovalSetup from "./components/ApprovalSetup";

const LOCAL_STORAGE_KEY = "teams-approval-scheme";

const BASE_API_URL = 'https://s3-eu-west-1.amazonaws.com/spx-development/contents/';

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
      const teamsRes = await fetch(`${BASE_API_URL}teams`)
      const teamsJson: Team[] = await teamsRes.json();
      const usersRes = await fetch(`${BASE_API_URL}users`)
      const usersJson: User[] = await usersRes.json();
      setTeams(teamsJson);
      setUsers(usersJson);
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

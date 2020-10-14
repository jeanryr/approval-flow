import React, { useEffect, useState } from "react";
import { ApprovalScheme, ApprovalSchemeItem, Team, User } from "../types";
import ApprovalItem from "./ApprovalItem";
import "./ApprovalSetup.css";

const LOCAL_STORAGE_KEY = "teams-approval-scheme";

function ApprovalSetup({
  selectedTeam,
  getUser,
  unSelectTeam,
  getAllUsers,
}: {
  selectedTeam: Team;
  getUser: (userId: string) => User;
  unSelectTeam: () => void;
  getAllUsers: () => User[];
}) {
  const [approvalScheme, setApprovalScheme] = useState<ApprovalSchemeItem[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  function initApprovalFlow() {
    return [
      {
        from: 0,
        to: 500,
        user_id: "",
      },
      {
        from: 500,
        to: 1000,
        user_id: "",
      },
      {
        from: 1000,
        to: -1,
        user_id: "",
      },
    ];
  }

  function getApprovalSchemeFromLocalStorage(): ApprovalScheme {
    const teamsApprovalScheme = localStorage.getItem(LOCAL_STORAGE_KEY);
    return teamsApprovalScheme ? JSON.parse(teamsApprovalScheme) : {};
  }

  function saveApprovalSchemeToLocalStorage() {
    if (checkIfCurrentApprovalSchemeIsOk()) {
      const teamsApprovalScheme = getApprovalSchemeFromLocalStorage();
      teamsApprovalScheme[selectedTeam.id] = approvalScheme;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teamsApprovalScheme));
      unSelectTeam();
    } else {
      alert("Something is wrong with your approval scheme, check that you have selected an user for each threshold");
    }
  }

  function checkIfCurrentApprovalSchemeIsOk() {
    for (let i = 0; i < approvalScheme.length; i++) {
      if (!approvalScheme[i].user_id || approvalScheme[i].user_id === "") return false;
      if (i < approvalScheme.length - 1 && approvalScheme[i].to !== approvalScheme[i + 1].from) return false;
    }
    return true;
  }

  function updateThreshold(index: number, threshold: number) {
    let newApprovalScheme = [...approvalScheme];
    if (index < newApprovalScheme.length) {
      newApprovalScheme[index].to = threshold;
      newApprovalScheme[index + 1].from = threshold;
    }
    setApprovalScheme(newApprovalScheme);
  }

  function updateUser(index: number, user_id: string) {
    let indexToSearch = index;
    if (index === -1) {
      indexToSearch = approvalScheme.length - 1;
    }
    let newAvailableUsers = [...availableUsers];
    newAvailableUsers.splice(
      newAvailableUsers.findIndex((e) => e.id === user_id),
      1
    );
    const userToAdd = getUser(approvalScheme[indexToSearch].user_id);
    if (userToAdd.first_name !== "Not" && !newAvailableUsers.includes(userToAdd)) {
      newAvailableUsers.push(userToAdd);
    }
    setAvailableUsers(newAvailableUsers);

    let newApprovalScheme = [...approvalScheme];
    newApprovalScheme[indexToSearch].user_id = user_id;
    setApprovalScheme(newApprovalScheme);
  }

  useEffect(() => {
    const teamsApprovalScheme = getApprovalSchemeFromLocalStorage();
    if (teamsApprovalScheme && teamsApprovalScheme[selectedTeam.id]) {
      let teamApprovalScheme = teamsApprovalScheme[selectedTeam.id];
      setApprovalScheme(teamApprovalScheme);
      let newAvailableUsers = [...getAllUsers()];
      teamApprovalScheme.forEach((scheme) => {
        newAvailableUsers.splice(
          newAvailableUsers.findIndex((e) => e.id === scheme.user_id),
          1
        );
      });
      setAvailableUsers(newAvailableUsers);
    } else {
      setApprovalScheme(initApprovalFlow());
      setAvailableUsers(getAllUsers());
    }
  }, [selectedTeam.id, getAllUsers]);

  return (
    <div className="container">
      <div className="card card-approval-setup">
        <h2 data-testid="selected-team-name">{selectedTeam.name}</h2>
        {approvalScheme.length < 2 ? (
          <div>There is an issue with the approval flow</div>
        ) : (
          <div className="card-body">
            {approvalScheme.map((approvalItem, index) => (
              <ApprovalItem
                key={`approvalItem${index}`}
                item={approvalItem}
                index={index === approvalScheme.length - 1 ? -1 : index}
                availableUsers={availableUsers}
                getUser={getUser}
                updateThreshold={updateThreshold}
                updateUser={updateUser}
              />
            ))}
            <button onClick={() => unSelectTeam()}>Cancel</button>
            <button data-testid="save-btn" onClick={() => saveApprovalSchemeToLocalStorage()}>
              Save approval flow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalSetup;

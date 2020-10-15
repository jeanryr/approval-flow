import React, { useEffect, useState } from "react";
import { TeamsApprovalScheme, ApprovalSchemeItem, Team, User } from "../types";
import ApprovalItem from "./ApprovalItem";
import "./ApprovalSetup.css";

function ApprovalSetup({
  selectedTeam,
  getUser,
  unSelectTeam,
  getAllUsers,
  getApprovalSchemeFromLocalStorage,
  saveApprovalSchemeToLocalStorage
}: {
  selectedTeam: Team;
  getUser: (userId: string) => User;
  unSelectTeam: () => void;
  getAllUsers: () => User[];
  getApprovalSchemeFromLocalStorage: ()=> TeamsApprovalScheme;
  saveApprovalSchemeToLocalStorage: (approvalSchemeItems: ApprovalSchemeItem[], selectedTeamId: string) => void;
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

  function addThreshold(index: number) {
    let newApprovalScheme = [...approvalScheme];
    newApprovalScheme.splice(index+1, 0, {from: newApprovalScheme[index].to, to: newApprovalScheme[index+1].from, user_id:"" })
    setApprovalScheme(newApprovalScheme);
  }

  function deleteThreshold(index: number) {
    let newApprovalScheme = [...approvalScheme];
    newApprovalScheme[index-1].to = newApprovalScheme[index].to;
    if (newApprovalScheme[index+1].to !== -1)
      newApprovalScheme[index-1].from = newApprovalScheme[index].from;
    newApprovalScheme.splice(index, 1);
    setApprovalScheme(newApprovalScheme);
  }

  function updateThreshold(index: number, threshold: number) {
    let newApprovalScheme = [...approvalScheme];
    if (index < newApprovalScheme.length && !isNaN(threshold)) {
      if ((index === 0 && (threshold > newApprovalScheme[index+1].to)) ||
      (index > 0 && index < newApprovalScheme.length -2 && (threshold > newApprovalScheme[index+1].to || threshold < newApprovalScheme[index].from)) ||
      (index === newApprovalScheme.length -2 && (threshold < newApprovalScheme[index].from)) 
      ){
        console.log(index === 0 && threshold < 0 );
        console.log(index > 0 && threshold < newApprovalScheme[index-1].from);
        console.log(index < newApprovalScheme.length -2 && threshold > newApprovalScheme[index+1].from);
        debugger;
        setApprovalScheme(newApprovalScheme);
        alert("that's not valid");
      }
      else {
       newApprovalScheme[index].to = threshold;
       newApprovalScheme[index + 1].from = threshold;
      }
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
  }, [selectedTeam.id, getAllUsers, getApprovalSchemeFromLocalStorage]);

  return (
    <div className="container">
      <div className="card card-approval-setup">
        <h2 data-testid="selected-team-name">{selectedTeam.name}</h2>
        {approvalScheme.length < 2 ? (
          <div>There is an issue with the approval flow</div>
        ) : (
          <div className="card-body">
            {approvalScheme.map((approvalItem, index) => (
              <div>
                <ApprovalItem
                  key={`approvalItem${index}`}
                  item={approvalItem}
                  index={index === approvalScheme.length - 1 ? -1 : index}
                  availableUsers={availableUsers}
                  getUser={getUser}
                  updateThreshold={updateThreshold}
                  deleteThreshold={deleteThreshold}
                  updateUser={updateUser}
                />
                {(index < approvalScheme.length -1) && <div style={{textAlign: "center"}}><button data-testid="add-threshold" onClick={() => addThreshold(index)}>Add a threshold</button></div>}
              </div>
            ))}
            <button onClick={() => unSelectTeam()}>Cancel</button>
            <button data-testid="save-btn" onClick={() => saveApprovalSchemeToLocalStorage(approvalScheme, selectedTeam.id)}>
              Save approval flow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalSetup;

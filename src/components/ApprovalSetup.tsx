import React, { useEffect, useState } from "react";
import { ApprovalScheme, Team, User } from "../types";
import ApprovalItem from "./ApprovalItem";
import "./ApprovalSetup.css";

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
  const [approvalScheme, setApprovalScheme] = useState<ApprovalScheme>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  function initApprovalFlow() {
    return [
      {
        from: 0,
        to: 500,
        user_id: "toto",
      },
      {
        from: 500,
        to: 1000,
        user_id: "",
      },
      {
        from: 500,
        to: -1,
        user_id: "toto",
      },
    ];
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
    let newAvailableUsers = [...availableUsers];
    newAvailableUsers.splice(newAvailableUsers.findIndex(e => e.id === user_id), 1);
    const userToAdd = getUser(approvalScheme[index].user_id);
    if (userToAdd.first_name !== 'Not'){
      newAvailableUsers.push(userToAdd);
    }
    setAvailableUsers(newAvailableUsers);

    let newApprovalScheme = [...approvalScheme];
    newApprovalScheme[index].user_id = user_id;
    setApprovalScheme(newApprovalScheme);
  }

  useEffect(() => {
    if (approvalScheme.length === 0) {
      setApprovalScheme(initApprovalFlow());
      setAvailableUsers(getAllUsers());
    } else {
      approvalScheme.map((scheme) => {
        let newAvailableUsers = [...availableUsers];
        newAvailableUsers.splice(newAvailableUsers.findIndex(e => e.id === scheme.user_id), 1);
        setAvailableUsers(newAvailableUsers);
      });
    }
  }, []);

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
            <button>Save approval flow</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalSetup;

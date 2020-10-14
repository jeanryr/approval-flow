import React, { useEffect, useState } from "react";
import { ApprovalSchemeItem, User } from "../types";
import "./ApprovalItem.css";

function ApprovalItem({
  item,
  index,
  availableUsers,
  updateThreshold,
  deleteThreshold,
  updateUser,
  getUser,
}: {
  item: ApprovalSchemeItem;
  index: number;
  availableUsers: User[];
  updateThreshold: (index: number, threshold: number) => void;
  deleteThreshold: (index: number) => void;
  updateUser: (index: number, userId: string) => void;
  getUser: (userId: string) => User;
}) {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const user = getUser(item.user_id);
    if (user.first_name !== "Not") {
      setCurrentUser(user);
    }
    else {
      setCurrentUser(undefined);
    }
  }, [item.user_id, getUser]);

  return (
    <div className="card card-approval-item">
      {index === 0 && (
        <div data-testid="up-to-elem">
          Up to
          <input
            data-testid="up-to-select"
            type="number"
            value={item.to}
            onChange={(e) => updateThreshold(index, parseInt(e.target.value))}
          />
          EUR
        </div>
      )}
      {index > 0 && (
        <div data-testid="from-to-elem">
          From {item.from}EUR to{" "}
          <input type="number" value={item.to} onChange={(e) => updateThreshold(index, parseInt(e.target.value))} />
          EUR <button data-testid="delete-threshold" style={{ float: "right" }} onClick={()=> deleteThreshold(index)}>Delete</button>
        </div>
      )}
      {index === -1 && (
      <div data-testid="above-elem" >Above {item.from}EUR</div>)}
      <select onChange={(e) => updateUser(index, e.target.value)}>
        {currentUser ? (
          <option value={currentUser.id}>
            {currentUser.first_name} {currentUser.last_name}
          </option>
        ) : (
          <option>No user selected yet</option>
        )}
        {availableUsers.map((user) => {
          return (
            <option key={`userOption-${user.id}`} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default ApprovalItem;

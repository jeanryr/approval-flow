import React, { useEffect, useState } from "react";
import { ApprovalSchemeItem, User } from "../types";
import "./ApprovalItem.css";

function ApprovalItem({
  item,
  index,
  availableUsers,
  updateThreshold,
  updateUser,
  getUser,
}: {
  item: ApprovalSchemeItem;
  index: number;
  availableUsers: User[];
  updateThreshold: (index: number, threshold: number) => void;
  updateUser: (index:number, userId: string) => void;
  getUser: (userId: string) => User;
}) {
  
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(()=>{
    const user = getUser(item.user_id);
    if (user.first_name !== 'Not'){
      setCurrentUser(user);
    }
  },[item.user_id])

  return (
    <div className="card card-approval-item">
      {index === 0 && (
        <div>
          Up to{" "}
          <input type="number" value={item.to} onChange={(e) => updateThreshold(index, parseInt(e.target.value))} />
          EUR
        </div>
      )}
      {index > 0 && (
        <div>
          From {item.from}EUR to{" "}
          <input type="number" value={item.to} onChange={(e) => updateThreshold(index, parseInt(e.target.value))} />
          EUR <button style={{ float: "right" }}>Delete</button>
        </div>
      )}
      {index === -1 && <div>Above {item.from}EUR</div>}
      <select onChange={(e) => updateUser(index, e.target.value)}>
        {currentUser ? <option value={currentUser.id} >{currentUser.first_name} {currentUser.last_name}</option> : <option>No user selected yet</option>}
        {availableUsers.map(user=>{
          return <option key={`userOption-${user.id}`} value={user.id} >{user.first_name} {user.last_name}</option>
        })}
      </select>
    </div>
  );
}

export default ApprovalItem;

import React, { useEffect, useState } from "react";
import { ApprovalSchemeItem, User } from "../types";
import "./ApprovalItem.css";

function ApprovalItem({
  item,
  index,
  updateThreshold,
  getUser,
}: {
  item: ApprovalSchemeItem;
  index: number;
  updateThreshold: (index: number, threshold: number) => void;
  getUser: (userId: string) => User;
}) {
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
          EUR <button style={{float: 'right'}}>Delete</button>
        </div>
      )}
      {index === -1 && <div>Above {item.from}EUR</div>}
    </div>
  );
}

export default ApprovalItem;

import React, { useEffect, useState } from "react";
import { Team, User } from "../types";
import "./TeamsList.css";

function TeamsList({
  teams,
  getUser,
}: {
  teams: Team[];
  getUser: (userId: string) => User;
}) {
  return (
    <div className="container">
      <div className="row">
        {teams.map((team) => (
          <div
            data-testid="team-list-card"
            className="card team-card"
            key={`${team.id}`}
          >
            <div
              data-testid="team-list-name"
              className="card-header team-header"
            >
              <h2>{team.name}</h2>
            </div>
            <div className="card-body">
              <div className="first-3 list-users">
                First users:
                <ul>
                  {team.users.map((userIndex: string, index: number) => {
                    if (index < 3) {
                      const user = getUser(userIndex);
                      return (
                        <li
                          data-testid="user-from-list-name"
                          key={`usr${index}`}
                        >{`${user.first_name} ${user.last_name}`}</li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamsList;

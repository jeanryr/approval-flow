import React from "react";
import { Team, User } from "../types";
import "./TeamsList.css";

function TeamsList({
  teams,
  selectTeam,
  getUser,
  approvalsByTeam
}: {
  teams: Team[];
  selectTeam: (team: Team) => void;
  getUser: (userId: string) => User;
  approvalsByTeam: {[teamId: string]: User[]};
}) {
  return (
    <div className="container">
      <div className="row">
        {teams.map((team) => (
          <div
            data-testid="team-list-card"
            onClick={() => selectTeam(team)}
            className="card team-card"
            key={`${team.id}`}
          >
            <div data-testid="team-list-name" className="card-header team-header">
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
                    } else {
                      return null;
                    }
                  })}
                </ul>
              </div>
              {approvalsByTeam && approvalsByTeam[team.id] &&
                <div data-testid="approval-list" className="list-users">
                  First approvals:
                  <ul>
                    {approvalsByTeam[team.id].map((user, index) => {
                      if (index < 3) {
                        return (
                          <li
                            data-testid="user-from-list-name"
                            key={`usr${index}`}
                          >{`${user.first_name} ${user.last_name}`}</li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ul>
                </div>
            }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamsList;

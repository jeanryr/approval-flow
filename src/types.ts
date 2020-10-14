export type Team = {
  id: string;
  name: string;
  users: string[];
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type ApprovalScheme = ApprovalSchemeItem[];

export type ApprovalSchemeItem = {
  from: number;
  to: number;
  user_id: string;
};
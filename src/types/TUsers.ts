export interface TAccount {
  message: string;
  success: boolean;
  account: Account;
}

export interface Account {
  name: string;
  email: string;
  password: string;
  _id: string;
  __v: number;
  token: string;
}

export type LoginResponse = {
  access_token: string;
  redirect_to: string;
};

export type ForgotResponse = {
  token: string;
  expires_in: number;
};

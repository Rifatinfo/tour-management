
export interface ISendOtp {
    email : string 
}
export interface IVerifyOtp {
    email : string,
    otp : string
}
export interface ILogin {
    email : string,
    password : string 
}

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}

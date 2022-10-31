export class ErrorHandler extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any | undefined
  ) {
    super();
  }
}

export interface IAdmin {
  _id?: any;
  id?: any;
  name: string;
  email: string;
  password: string;
  role: string;
}
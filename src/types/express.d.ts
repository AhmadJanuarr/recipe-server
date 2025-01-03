import "express";
declare module "express" {
    export interface Request {
        payload?: any;
    }
}

declare global {
  namespace Express {
    interface Request {
      payload?: {
        userId: string;
        [key: string]: any;
      };
    }
  }
}
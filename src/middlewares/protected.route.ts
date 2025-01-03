import  jwt from 'jsonwebtoken';
import {  Request, Response } from "express"

export const isAuthenticated = (req : Request, res : Response)  => {
    const {authorization} = req.headers

    // mengecek apakah ada token
    if(!authorization){
      res.status(401).send({
        success : false,
        message : "Un-Authorized"
      })
      return;
    }

    try {
        const token = authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret') as {userId : string};
        req.payload = {userId : decode.userId};   
      } catch (err) {
        res.status(401);
        if ((err as Error).name === 'TokenExpiredError') {
          throw new Error((err as Error).name);
        }
        throw new Error('Un-Authorized');  
      }
    }
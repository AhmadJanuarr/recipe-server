import { prisma } from "../../prisma/client/prisma";
import { HashToken } from "../utils/hashToken";

interface AddRefreshTokenToWhitelistProps {
    refreshToken: string;
    userId: number; 
}
export const AddRefreshTokenToWhitelist = ({refreshToken, userId} : AddRefreshTokenToWhitelistProps ) =>{
    return prisma.refreshToken.create({
        data : {
            hashToken :HashToken(refreshToken),
            userId,
                expiresAt:new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        }
    })
}

export const FindRefreshToken = (token : string) =>{
    return prisma.refreshToken.findFirst({
        where : {
            hashToken : HashToken(token)
        }
    })
}

export const DeleteRefreshTokenById = (id : number) =>{
    return prisma.refreshToken.update({
        where :{
            id
        },
        data :{
            revoked : true
        }
    })
}

export const RevokeTokens = (userId : number) =>{
    return prisma.refreshToken.updateMany({
        where : {
            userId
        },
        data : {
            revoked : true
        }
    })
}
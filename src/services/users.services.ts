import { prisma } from "../../prisma/client/prisma"
import  bcrypt  from 'bcrypt';

export const FindUserByEmail = (email : string) => {
    return  prisma.user.findUnique({
        where: {email}
    })
}

export const FindUserById =(id :number) =>{
    return prisma.user.findUnique({
        where: {id}
    })
}

export const CreateUserByEmailAndPassword = (user : any) =>{
    user.password = bcrypt.hashSync(user.password, 10)
    return prisma.user.create({
    data:  {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    
})
}
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { User } from "generated/prisma/client";

export const Authorizate=createParamDecorator((data:keyof User,context:ExecutionContext)=>{
    const request= context.switchToHttp().getRequest() as Request;

    const user= request.user;

    return data ? user![data] :user;
})
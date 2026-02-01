import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../guards/auth.gurad";

export function Authorization(){
    return applyDecorators(UseGuards(JwtGuard));
}
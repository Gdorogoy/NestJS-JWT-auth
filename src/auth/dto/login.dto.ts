import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class LoginRequest{

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(21)
    password:string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;
}
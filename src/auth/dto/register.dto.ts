import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class RegisterRequest{

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name:string;

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
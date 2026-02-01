import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class LoginRequest{

    @ApiProperty({
        description:'user password',
        example:'Abcd1234!'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(21)
    password:string;
    
    @ApiProperty({
        description:'user email',
        example:'test@gmail.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;
}
import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse{

    @ApiProperty({
        description:'User access token',
        example:'test.testpayload.testalgo'
    })
    accessToken:string;
}
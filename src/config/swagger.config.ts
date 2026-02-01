import { DocumentBuilder } from "@nestjs/swagger";


export function swaggerConfig(){

    return new DocumentBuilder()
        .setTitle('NestJs Course API')
        .setDescription('API For NestJs')
        .setVersion('1.0.0')
        .setContact('Georigy Dorogoy','github','test@gmail')
        .addBearerAuth()
        .build();
    
}
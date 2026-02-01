import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from "src/config/swagger.config";


export function setupSwagger(app: INestApplication){

    const config=swaggerConfig();

    const documnet=SwaggerModule.createDocument(app,config);

    SwaggerModule.setup('/docs',app,documnet);
}
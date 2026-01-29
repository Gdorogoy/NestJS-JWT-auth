"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtConfig = getJwtConfig;
async function getJwtConfig(configService) {
    return {
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
            algorithm: 'HS256',
        },
    };
}
//# sourceMappingURL=jwt.config.js.map
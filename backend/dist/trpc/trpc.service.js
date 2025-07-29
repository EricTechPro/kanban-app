"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrpcService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const express = require("express");
const trpcExpress = require("@trpc/server/adapters/express");
const auth_service_1 = require("../auth/auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const app_router_1 = require("./app.router");
const context_1 = require("./context");
let TrpcService = class TrpcService {
    constructor(authService, prisma, jwtService, configService) {
        this.authService = authService;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    onModuleInit() {
        const app = express();
        app.use('/trpc', trpcExpress.createExpressMiddleware({
            router: app_router_1.appRouter,
            createContext: (0, context_1.createContext)(this.authService, this.prisma, this.jwtService),
        }));
        const port = this.configService.get('TRPC_PORT') || 3002;
        app.listen(port, () => {
            console.log(`tRPC server running on port ${port}`);
        });
    }
};
exports.TrpcService = TrpcService;
exports.TrpcService = TrpcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TrpcService);
//# sourceMappingURL=trpc.service.js.map
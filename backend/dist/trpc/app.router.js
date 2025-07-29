"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const auth_router_1 = require("./routers/auth.router");
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    auth: auth_router_1.authRouter,
});
//# sourceMappingURL=app.router.js.map
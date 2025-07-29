"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const createContext = (authService, prisma, jwtService) => {
    return async ({ req }) => {
        let user = undefined;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwtService.verify(token);
                user = {
                    id: decoded.userId,
                    email: decoded.email,
                };
            }
            catch (error) {
            }
        }
        return {
            user,
            authService,
            prisma,
        };
    };
};
exports.createContext = createContext;
//# sourceMappingURL=context.js.map
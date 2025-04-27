"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv/config");
const app = (0, express_1.default)();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting server...");
    const PORT = process.env.PORT || 5001;
    // Setup the session middleware
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false, // Only save sessions when necessary
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    }));
    // Middleware to parse JSON requests
    app.use(express_1.default.json());
    // Middleware to handle CORS -> to allow requests from the frontend
    app.use((0, cors_1.default)({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    //Routes
    app.use("/api", require("./routes/MoodRoutes"));
    console.log("Routes mounted");
    app.listen(PORT, () => {
        var _a;
        console.log(`⚡️[server]: Server is running on: ${(_a = process.env.BACKEND_SERVER_URL) !== null && _a !== void 0 ? _a : `http://localhost:${PORT}`}`);
    });
});
startServer();
exports.default = startServer;
//# sourceMappingURL=app.js.map
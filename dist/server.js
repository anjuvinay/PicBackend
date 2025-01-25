"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./infrastructure/route/userRoute"));
const http_1 = require("http");
const dbConnection_1 = require("./infrastructure/config/dbConnection");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
(0, dbConnection_1.connectToDatabase)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
app.use('/uploads', express_1.default.static(uploadsDir));
app.use("/", userRoute_1.default);
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

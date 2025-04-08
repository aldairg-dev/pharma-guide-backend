import express from "express";
import routerUser from "./modules/user/router/user.router";

const app = express();

app.use(express.json());
app.use("/api/users", routerUser);

export default app;

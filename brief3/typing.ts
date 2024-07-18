import { Request } from "express";
import { SafeUserType } from "./models/User";

export type Post = {
    id: number;
    userId: number;
}

import { Request } from "express";
import { SafeUserType } from "../../models/User";

export type TheRequest = ({user?:SafeUserType} & Request)
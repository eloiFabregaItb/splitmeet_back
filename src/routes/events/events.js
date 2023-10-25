import express from "express";
// import { io } from "../server";

import { jwtVerify } from "../../utils/jwt.js";

const router = express.Router()
export default router


import route_create from "./endpoints/create.js"
import route_getUsers from "./endpoints/getUsers.js"
import route_join from "./endpoints/join.js"

router.use('',route_create)
//      /event/create


router.use('',route_getUsers)
//      /event/getUsers

router.use('',route_join)
//      /event/join



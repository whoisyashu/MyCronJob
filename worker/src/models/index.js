import mongoose from "mongoose";
import { createStatusLogModel } from "../../../shared/models/statusLog.model.js";
import { createWebsiteModel } from "../../../shared/models/website.model.js";

export const Website = createWebsiteModel(mongoose);
export const StatusLog = createStatusLogModel(mongoose);

import express from "express";
import {
  createItem,
  getAllLostItems,
  getAllFoundItems,
  updateItemDetails,
  deleteItem,
  searchItems,
  updateItemStatus,
  getAllItems,
  getItemById,
  getUserItems,
} from "../controllers/items.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const itemRouter = express.Router();

itemRouter.get("/all", authMiddleware, getAllItems);
itemRouter.post("/create", authMiddleware, upload.fields([
  {
    name: 'itemImage',
    maxCount: 1
  }
]), createItem);
itemRouter.get("/lost", authMiddleware, getAllLostItems);
itemRouter.get("/found", authMiddleware, getAllFoundItems);
itemRouter.get("/search", authMiddleware, searchItems);
itemRouter.get("/:id", authMiddleware, getItemById);
itemRouter.patch("/update-status/:id", authMiddleware, updateItemStatus);
itemRouter.patch("/update-details/:id", authMiddleware, updateItemDetails);
itemRouter.delete("/delete-item/:id", authMiddleware, deleteItem);
itemRouter.get("/user/:userId", authMiddleware, getUserItems);

export { itemRouter };

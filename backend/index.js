import dotenv from "dotenv";
import connectDB from "./src/db/connect.js";
import { app } from "./src/app.js";
import {createServer} from "http"
import { Server } from "socket.io";
import { User } from "./src/models/User.model.js";


dotenv.config({
    path : "./.env"
});

const seedAdmin = async () => {
    const admin = await User.findOne({ role : process.env.ADMIN_ROLE });
    if(!admin) {
        const systemAdmin = await User.create({
            name : process.env.ADMIN_NAME,
            username : process.env.ADMIN_USERNAME,
            email : process.env.ADMIN_EMAIL,
            password : process.env.ADMIN_PASSWORD,
            role : process.env.ADMIN_ROLE
        });
        systemAdmin.save();
        console.log("Admin Created Successfully");
    }
    else {
        console.log('Admin Already Exists');
    }
}

connectDB().
then(() => {
    seedAdmin();
    const server = createServer(app);
    const io = new Server(server , {});
    io.on("connection" , (socket) => {
        console.log(`New User Connected ${socket.id}`);
        socket.on("disconnect" , () => {
            console.log("User disconnected Successfully");
        });
    })
    server.listen(process.env.PORT || 3000 , () => {
        console.log(`Server is running on Port ${process.env.PORT} the socketId is`);
    }) 
}).catch((err) => {
    console.log('Database Connection failed !!' , err);
});

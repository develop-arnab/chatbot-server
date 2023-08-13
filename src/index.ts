import express, {Request, Response} from "express";
import router from './routes/apiRouter'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
//@ts-ignore
import connectMongo from './db/mongodb'
const app = express();
const port = 4000;
app.use(cors())
app.use(bodyParser())
app.use(cookieParser())
// crate database connection
connectMongo();
app.get('/', async (req : Request, res: Response ) => {

res.send("ping pong")
});

app.use('/api', router)

app.listen(port, () => {
    console.log("Server running on : ", port)
})
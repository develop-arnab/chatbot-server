import express, {Request, Response} from "express";
import router from './routes/apiRouter'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
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

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where uploaded files will be saved
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Specify how uploaded files should be named
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  // Serve static files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Handle file upload POST request
app.post('/upload', upload.single('file'), (req, res) => {
  // The uploaded file can be accessed as req.file
  res.send('File uploaded successfully');
});


app.use('/api', router)

app.listen(port, () => {
    console.log("Server running on : ", port)
})
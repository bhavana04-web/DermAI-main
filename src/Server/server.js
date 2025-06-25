import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } 
});

app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dermai", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    lesionType: {
      type: String,
      required: true,
      enum: [
        "Actinic Keratoses",
        "Benign Keratosis",
        "Melanoma",
        "Melanocytic Nevi",
        "Basal Cell Carcinoma",
      ],
    },
    lesionInfo: {
      type: Object,
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    profile: {
      age: {
        type: Number,
        min: 1,
        max: 120,
      },
      location: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const patientDocumentSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model("Analysis", analysisSchema);
const User = mongoose.model("User", userSchema);
const PatientDocument = mongoose.model("PatientDocument", patientDocumentSchema);

const generateUserId = () => Math.floor(10000 + Math.random() * 90000);

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    const userId = generateUserId();
    const newUser = new User({ userId, name, email, password });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId, name, email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/profile-setup", async (req, res) => {
  try {
    const { email, location, age } = req.body;

    if (!email || !location || !age) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.profile = { location, age };
    await user.save();

    return res.json({
      success: true,
      message: "Profile setup completed successfully",
    });
  } catch (error) {
    console.error("Profile setup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});


app.post("/save-analysis", async (req, res) => {
  try {
    const { userId, image, lesionType, lesionInfo, doctorInfo } = req.body;

    if (!userId || !image || !lesionType || !lesionInfo || !doctorInfo) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    const analysis = new Analysis({
      userId,
      image,
      lesionType,
      lesionInfo,
      doctorInfo,
    });

    await analysis.save();
    res.json({ 
      success: true, 
      message: "Analysis saved successfully" 
    });
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
});

app.get("/api/analyses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const analyses = await Analysis.find({ userId: Number(userId) })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ 
      success: true, 
      data: analyses 
    });
  } catch (error) {
    console.error("Get analyses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analyses",
      error: error.message,
    });
  }
});

app.get("/api/analyses/single/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ 
        success: false, 
        message: "Analysis not found" 
      });
    }
    return res.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
      error: error.message,
    });
  }
});

app.get("/api/doctor/search", async (req, res) => {
  try {
    const { name, email, userId } = req.query;
    let query = {};
    
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (userId) query.userId = Number(userId);

    const patients = await User.find(query).select("-password");
    res.json({ 
      success: true, 
      data: patients 
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to search patients",
      error: error.message
    });
  }
});

app.post("/api/doctor/upload", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    const document = new PatientDocument({
      userId: Number(userId),
      filename: req.file.originalname,
      path: req.file.path,
      uploadedBy: req.user?._id || null
    });

    await document.save();

    res.json({ 
      success: true, 
      message: "File uploaded successfully",
      data: {
        _id: document._id,
        filename: document.filename,
        url: `/uploads/${path.basename(document.path)}`,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to upload file",
      error: error.message
    });
  }
});

app.get("/api/doctor/documents/:userId", async (req, res) => {
  try {
    const documents = await PatientDocument.find({ 
      userId: Number(req.params.userId) 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: documents.map(doc => ({
        _id: doc._id,
        filename: doc.filename,
        url: `/uploads/${path.basename(doc.path)}`,
        createdAt: doc.createdAt
      }))
    });
  } catch (error) {
    console.error("Documents error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get documents",
      error: error.message
    });
  }
});

app.delete("/api/doctor/documents/:id", async (req, res) => {
  try {
    const document = await PatientDocument.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: "Document not found" 
      });
    }
    
    // Delete the actual file
    fs.unlink(document.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    
    res.json({ 
      success: true, 
      message: "Document deleted successfully" 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete document",
      error: error.message
    });
  }
});

app.delete("/api/doctor/analyses/:id", async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: "Analysis deleted successfully" 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete analysis",
      error: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error",
    error: err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Endpoint not found" 
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
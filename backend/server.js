const express = require('express');
const http = require("http");
const app = express();

const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connection } = require('./postgres/postgres');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');


const { where } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require("path");

const fs = require("fs");
const multer = require("multer");
const uploadDir = "uploads";
app.use(express.json());

app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: false,
    cookie: {
           
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(
    cors({
      origin: ["http://localhost:5173", "https://lprz178q-5173.inc1.devtunnels.ms"], // Add both local and tunnel origins
      credentials: true, // Allow cookies/session headers
    })
  );
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());
app.use(passport.session());
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, ""); // Remove spaces & special characters
        cb(null, sanitizedOriginalName);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});




passport.use(new GoogleStrategy({
    clientID: '683137550793-qo3354aq3mg1dr6k9nvn747vip5vlb98.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log("profile: ", profile);
    try {
        const models = await connection();
        if (!models) {
            return done(new Error('Models not initialized'), false);
        }


        const { id, displayName, emails, photos } = profile; // Retrieve photos as well
        
        const profilePhoto = photos && photos.length > 0 ? photos[0].value : null;

        console.log("Profile Photo:", profilePhoto);

        const email = emails[0].value;
        console.log("email: ", email);

          

        let user = await models.User.findOne({ where: { email } });
        if (!user) {
            return done(null, false, { message: "User not found. Please register first." });
        }
        user.profilePhoto = profilePhoto;
        await user.save();
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const models = await connection();
        const user = await models.User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
app.get('/verify-auth', (req, res) => {
    const userId = req.cookies.userId;
    const profilePhoto = req.cookies.profilePhoto;
    console.log("user id in auth:", userId);

    if (userId) {
        res.json({
            authenticated: true,
            role: req.cookies.userRole,
            profilePhoto: profilePhoto
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));



app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
}), async (req, res) => {
    try {
        console.log("Inside the auth callback");
        console.log("User ID from req.user:", req.user.id);

        const model = await connection();
        const user = req.user;

        res.cookie('userId', user.id, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('userRole', user.role, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('profilePhoto', user.profilePhoto, { maxAge: 24 * 60 * 60 * 1000 }); // Set profile photo in cookies

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        console.log("User role:", user.role);
        if (user) {
            if (user.role === 'student') {
                res.redirect("http://localhost:5173/student");
            } else if (user.role === 'faculty') {
                res.redirect("http://localhost:5173/faculty");
            } else if (user.role === 'eventManager') {
                const eventManager = await model.EventManager.findOne({
                    where: { user_id: user.id }
                });
                console.log("event_manager info: ", eventManager);

                res.cookie("eventManagerId", eventManager.id, {
                    secure: false,
                    expires: new Date(Date.now() + 3600000),
                });

                res.cookie("experience", eventManager.experience, {
                    secure: false,
                    expires: new Date(Date.now() + 3600000),
                });

                res.redirect("http://localhost:5173/eventManager");
            }
        }

    } catch (error) {
        console.error("Error during authentication callback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/logout', async (req, res) => {
    try {
        res.clearCookie('userId', { path: '/' });
        res.clearCookie('userRole', { path: '/' });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Logout error" });
    }
});

app.get("/student/register", async (req, res) => {
    try {

        const userId = req.cookies.userId;
        if (!userId) {
            res.status(400).json({ error: "User not found" });
        }

        const model = await connection();
        const user = await model.User.findOne({
            where: { id: userId }
        });

    }
    catch (e) {

    }
})
app.get("/student/studentDetails", async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is missing in cookies" });
        }

        const model = await connection();
        const user = await model.User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const models = await connection();

        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password cannot be empty' });
        }

        const user = await models.User.findOne({ where: { email } });

        if (user) {
            console.log("User ID:", user.id);

            res.cookie("userId", user.id, {

                secure: false,
                expires: new Date(Date.now() + 3600000),
            });

            res.cookie("userRole", user.role, {

                secure: false,
                expires: new Date(Date.now() + 3600000),
            });

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                let eventManagerData = {};

                if (user.role === "eventManager") {
                    const eventManager = await models.EventManager.findOne({ where: { user_id: user.id } });

                    if (eventManager) {
                        eventManagerData = {
                            event_manager_id: eventManager.id,
                            experience: eventManager.experience,
                        };

                        res.cookie("eventManagerId", eventManager.id, {

                            secure: false,
                            expires: new Date(Date.now() + 3600000),
                        });

                        res.cookie("experience", eventManager.experience, {

                            secure: false,
                            expires: new Date(Date.now() + 3600000),
                        });
                    }
                }

                return res.status(200).json({
                    message: 'Login successful',
                    user,

                });
            } else {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/getEvents', async (req, res) => {
    try {
        const model = await connection();
        const eventDetails = await model.EventRegister.findAll(
            {attributes:['id','event_title','event_description','event_date', 'event_image','target_audience']}
        );

        res.json(eventDetails); 
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/event/dashboard", async (req, res) => {
    
    const event_manager_id = req.cookies.eventManagerId;
    const experience = req.cookies.experience;

    console.log("Event Manager ID from cookies:", event_manager_id);
    console.log("Experience from cookies:", experience);

    if (!event_manager_id || !experience) {
        return res.status(401).json({ error: "Unauthorized: Missing event manager ID or experience" });
    }

    try {
        const models = await connection();
        const events = await models.EventRegister.findAll({
            where: { event_manager_id: event_manager_id }
        });
        console.log("hello");
        console.log(events);

        res.status(200).json({
            message: "Event manager dashboard data fetched successfully",
            events: events,  });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const models = await connection();

        const user = await models.User.findOne({ where: { email } });

        if (user) {
            const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the saltRounds

            await models.User.update(
                { password: hashedPassword },
                { where: { email } }
            );

            res.json({ message: "Password has been successfully updated." });
        } else {
            res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.use("/uploads", express.static("uploads"));

app.post("/createEvent", upload.single("event_image"), async (req, res) => {
    const {
        event_title, event_category, event_description, event_date,
        event_time, event_venue, expected_participants, organizer_name,
        organizer_email, organizer_phone, sponsorship_info, event_website,
        additional_notes, organization_name, target_audience
    } = req.body;

    const event_manager_id = req.cookies.eventManagerId;
    const experience = req.cookies.experience;

    if (!event_manager_id || !experience) {
        return res.status(401).json({ error: "Unauthorized: Missing event manager ID or experience" });
    }

    try {
        const models = await connection();
        const newEvent = await models.EventRegister.create({
            event_title, event_category, event_description, event_date,
            event_time, event_venue, expected_participants, organizer_name,
            organizer_email, organizer_phone, sponsorship_info, event_website,
            additional_notes, organization_name, target_audience, event_manager_id, experience,
            event_image: req.file ? `/uploads/${req.file.filename}` : null, // Save correct path
            status: 'pending' // Default status set to "pending"
        });
        
        return res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});



app.post('/addUser', async (req, res) => {
    try {
        const { name, email, password, role, additionalInfo } = req.body;
        const models = await connection();

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        const user = await models.User.create({ name, email, password: hashedPassword, role });

        if (role === 'student') {
            const { prn, course, branch, year } = additionalInfo;
            await models.Student.create({
                userId: user.id,
                prn,
                course,
                branch,
                year
            });
        } else if (role === 'faculty') {
            const { facultyId, department, designation } = additionalInfo;
            await models.Faculty.create({
                userId: user.id,
                facultyId,
                department,
                designation
            });
        } else if (role === 'eventManager') {
            const { organizationName, eventManagerId, experience } = additionalInfo;
            await models.EventManager.create({
                userId: user.id,
                organizationName,
                eventManagerId,
                experience
            });
        }

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

const startServer = async () => {
    try {
        await connection();  // Ensure models are loaded and DB is connected
        app.listen(5000, () => console.log('Server running on port 5000'));
    } catch (error) {
        console.error('Error during server initialization:', error);
    }
};

startServer();
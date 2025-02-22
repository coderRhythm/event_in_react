const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const models = require('./models');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");

const uploadDir = "uploads";

  
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: 'your_secret_key',resave: true,saveUninitialized: false,cookie: {    secure: false,    maxAge: 24 * 60 * 60 * 1000}}));
app.use(cors({  origin: ["http://localhost:5173", "https://lprz178q-5173.inc1.devtunnels.ms/"],  credentials: true, }));
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());
app.use(passport.session());
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
  
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
    
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  
  const broadcastEventCreation = (eventData) => {
    io.emit("new_event", eventData); 
  };
if (!fs.existsSync(uploadDir)) {fs.mkdirSync(uploadDir);}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, ""); 
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

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sethiyarhythm494@gmail.com",  
        pass: "jqek xdtz uyvz xmlc"  
    }
});
let otpStore = {};  

app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    const user = await models.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    const mailOptions = {
        from: "sethiyarhythm494@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for resetting your password is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email", error });
    }
});

const jwt = require("jsonwebtoken");

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (otpStore[email].otp !== parseInt(otp)) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign({ email }, "MY_SECRET_KEY", { expiresIn: "10m" });

    delete otpStore[email];
    console.log("Tokens: ", token);

    res.cookie("resetToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 60 * 1000,
    });

    res.json({ message: "OTP verified, you can now reset your password" });
});

app.post("/reset-password", async (req, res) => {
    const { newPassword } = req.body;
    const token = req.cookies.resetToken;
    console.log("tokens in reset: ", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token found" });
    }

    try {
        const decoded = jwt.verify(token, "MY_SECRET_KEY");
        const email = decoded.email;
        console.log("verified");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("password is hashed");

        const [updated] = await models.User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        if (updated) {
            console.log("✅ Password updated successfully!");
        } else {
            console.log("❌ User not found or password update failed.");
        }

        res.clearCookie("resetToken");
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});



const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
passport.use(new GoogleStrategy({
    clientID: '683137550793-qo3354aq3mg1dr6k9nvn747vip5vlb98.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log("profile: ", profile);
    try {
        if (!models) {
            return done(new Error('Models not initialized'), false);
        }
        const { id, displayName, emails, photos } = profile; 
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

        const user = req.user;

        res.cookie('userId', user.id, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('userRole', user.role, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('profilePhoto', user.profilePhoto, { maxAge: 24 * 60 * 60 * 1000 }); 

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
                const eventManager = await models.EventManager.findOne({
                    where: { userId: user.id }
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
app.post('/registerEvent', async (req, res) => {
    try {
        const { student_id, eventId, phone_number, role } = req.body; // Added role field

        if (!student_id || !eventId || !phone_number) {
            return res.status(400).json({ message: 'Student ID, Event ID, and Phone number are required' });
        }

        const user = await models.User.findByPk(student_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const event = await models.Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const alreadyRegistered = await models.Register.findOne({
            where: { user_id: student_id, event_id: eventId },
        });
        if (alreadyRegistered) {
            return res.status(409).json({ message: 'User already registered for this event' });
        }

        const registration = await models.Register.create({
            user_id: student_id,
            event_id: eventId,
            phone_number,
            role: role || null, // Store role if provided, otherwise set to null
        });

        return res.status(201).json({
            message: 'User registered successfully',
            registration,
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.get("/student/studentDetails", async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is missing in cookies" });
        }

        const user = await models.User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/getFaculties", async (req, res) => {
    try {
        const faculties = await models.Faculty.findAll();
        
        const userIds = faculties.map(faculty => faculty.userId);

        const users = await models.User.findAll({
            where: { id: userIds },
            attributes: ["id", "name"], 
        });

        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {});

        const facultiesWithUsers = faculties.map(faculty => ({
            userId: faculty.userId,
            userName: userMap[faculty.userId] || "Unknown", 
        }));

        console.log(facultiesWithUsers);
        res.status(200).json({ faculties: facultiesWithUsers });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/assign', async (req, res) => {
    try {
      const { userId, eventId } = req.body; 
      const faculty = await models.Faculty.findOne({ where: { userId: userId } });
  
      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }
  
      const event = await models.Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const existingAssignment = await models.AssignFaculty.findOne({
        where: {
          facultyId: faculty.id, 
          eventId: eventId, 
        }
      });
  
      if (existingAssignment) {
        return res.status(400).json({ message: 'Event already assigned to this faculty' });
      }
  
      const assignedEvent = await models.AssignFaculty.create({
        eventId: eventId,
        facultyId: faculty.id,
        userId: userId
      });
  
      res.status(201).json({
        message: 'Event assigned to faculty successfully',
        assignedEvent
      });
  
    } catch (error) {
      console.error('Error assigning event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
app.put("/updateStatus/:EventId", async (req,res)=>{
    try{
        const {EventId} = req.params;
        const event = await models.Event.findByPk(EventId);
        if(!event)
        {
            return res.status(404).json({ message: "Event not found" });
        }
        event.status = "approved";
        await event.save();
        res.json({ message: "Event date updated successfully", event });
    }
    catch(error)
    {
        console.error("Error updating event date:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("email:", email);
    console.log(password);
    
    
    try {
        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password cannot be empty' });
        }

        if (email == "admin@gmail.com" && password == "admin123") {
            console.log("admin login");
            
            res.cookie("userId", -1, {
                secure: false,
                expires: new Date(Date.now() + 3600000),
            });

            res.cookie("userRole", "admin", {
                secure: false,
                expires: new Date(Date.now() + 3600000),
            });

            return res.status(200).json({
                message: 'Admin login successful',
                user: { id: -1, email, role: "admin" },
            });
        }

        const user = await models.User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

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
                const eventManager = await models.EventManager.findOne({ where: { userId: user.id } });

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
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getEvents', async (req, res) => {
    try {
        const eventDetails = await models.Event.findAll();
        res.json(eventDetails); 
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get('/api/registered-events/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log("Fetching registered events for userId:", userId);

    try {
        // Step 1: Fetch all registered entries for the user
        const registeredEntries = await models.Register.findAll({
            where: { user_id: userId }
        });

        if (!registeredEntries.length) {
            return res.json({
                count: 0,
                registeredEvents: [],
                eventDetails: [],
                message: "No registered events found."
            });
        }

        // Step 2: Extract all event IDs from the registered entries
        const eventIds = registeredEntries.map(entry => entry.event_id);

        // Step 3: Fetch event details for those event IDs
        const eventDetails = await models.Event.findAll({
            where: { id: eventIds }
        });

        // Step 4: Return the count, registered events, and event details
        res.json({
            count: registeredEntries.length,
            registeredEvents: registeredEntries,
            eventDetails: eventDetails
        });
    } catch (error) {
        console.error('Error fetching registered events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/getPaginatedEvents', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; 
        const offset = (page - 1) * limit; 

        const eventDetails = await models.Event.findAll({
            limit: limit,
            offset: offset,
            order: [['event_date', 'DESC']] 
        });

        const pendingEvents  = await models.Event.findAll({
            where: { status: 'pending' },
            limit: limit,
            offset: offset,

        })
        const ApprovedEvents = await models.Event.findAll({
            where: { status: 'approved' },
            limit: limit,
            offset: offset,
        })


        const totalEvents = await models.Event.count();
       
        const totalApprovedEvents = await models.Event.count({
            where: { status: 'approved' }
            });
        
            // finding total events of status ='pending';
            const totalPendingEvents = await models.Event.count({
                where: { status: 'pending' }
                });
        res.json({
            events: eventDetails,
            totalEvents: totalEvents,
            pendingEvents: pendingEvents,
            ApprovedEvents: ApprovedEvents,
            totalApprovedPages: Math.ceil(totalApprovedEvents/limit),
            totalPendingPages: Math.ceil(totalPendingEvents/limit),
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page
        });

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
        const events = await models.Event.findAll({
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

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyC8ALqlde95XjOqEM9kS2gfOYwS7tURdxM');

app.post("/chatbot", async (req, res) => {
    try {
      const { message, event } = req.body;
  
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      let prompt;
  
      if (event) {
        
        const filteredEvent = {
          event_title: event.event_title,
          event_category: event.event_category,
          event_description: event.event_description,
          event_date: event.event_date,
          event_time: event.event_time,
          event_venue: event.event_venue,
          expected_participants: event.expected_participants,
          organizer_name: event.organizer_name,
          organizer_email: event.organizer_email,
          organizer_phone: event.organizer_phone,
          sponsorship_info: event.sponsorship_info,
          event_website: event.event_website,
          additional_notes: event.additional_notes,
          organization_name: event.organization_name,
          target_audience: event.target_audience,
          event_type: event.event_type,
          status: event.status,
        };
  
        prompt = `The user asked: "${message}". Here are the details of the selected event: ${JSON.stringify(filteredEvent)}. Provide a response.`;
      } else {
        const allEvents = await models.Event.findAll(); 
  
        const filteredEvents = allEvents.map((event) => ({
          event_title: event.event_title,
          event_category: event.event_category,
          event_description: event.event_description,
          event_date: event.event_date,
          event_time: event.event_time,
          event_venue: event.event_venue,
          expected_participants: event.expected_participants,
          organizer_name: event.organizer_name,
          organizer_email: event.organizer_email,
          organizer_phone: event.organizer_phone,
          sponsorship_info: event.sponsorship_info,
          event_website: event.event_website,
          additional_notes: event.additional_notes,
          organization_name: event.organization_name,
          target_audience: event.target_audience,
          event_type: event.event_type,
          status: event.status,
        }));
  
        prompt = `The user asked: "${message}". Here are all the events: ${JSON.stringify(filteredEvents)}. Provide a response.`;
      }
  
      if (message.toLowerCase().includes("event_id")) {
        return res.json({
          response: "Sorry, event IDs are not available for security reasons.",
        });
      }
  
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
  
      res.json({
        response: response,
      });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ response: "Error processing your request." });
    }
  });
app.post("/createEvent", upload.single("event_image"), async (req, res) => {
    const {
        event_title, event_category, event_description, event_date,
        event_time, event_venue, expected_participants, organizer_name,
        organizer_email, organizer_phone, sponsorship_info, event_website,
        additional_notes, organization_name, target_audience,event_type
    } = req.body;

    const event_manager_id = req.cookies.eventManagerId;
    const experience = req.cookies.experience;

    if (!event_manager_id || !experience) {
        return res.status(401).json({ error: "Unauthorized: Missing event manager ID or experience" });
    }

    try {
        const newEvent = await models.Event.create({
            event_title, event_category, event_description, event_date,
            event_time, event_venue, expected_participants, organizer_name,
            organizer_email, organizer_phone, sponsorship_info, event_website,
            additional_notes, organization_name, target_audience, event_manager_id, experience,
            event_image: req.file ? `/uploads/${req.file.filename}` : null, 
            status: 'pending', event_type
        });
        broadcastEventCreation(newEvent);
        const mailOptions = {
            from: '"Event Manager Notification" <youradminemail@gmail.com>',
            to: "1032212447@mitwpu.edu.in",
            subject: `New Event Created: ${event_title}`,
            html: `
                <h3>A new event has been created and is pending approval.</h3>
                <p><strong>Event Title:</strong> ${event_title}</p>
                <p><strong>Category:</strong> ${event_category}</p>
                <p><strong>Description:</strong> ${event_description}</p>
                <p><strong>Date:</strong> ${event_date}</p>
                <p><strong>Time:</strong> ${event_time}</p>
                <p><strong>Venue:</strong> ${event_venue}</p>
                <p><strong>Expected Participants:</strong> ${expected_participants}</p>
                <p><strong>Organizer:</strong> ${organizer_name} (${organizer_email}, ${organizer_phone})</p>
                <p><strong>Sponsorship Info:</strong> ${sponsorship_info || "N/A"}</p>
                <p><strong>Website:</strong> ${event_website ? `<a href="${event_website}">${event_website}</a>` : "N/A"}</p>
                <p><strong>Additional Notes:</strong> ${additional_notes || "N/A"}</p>
                <p><strong>Organization:</strong> ${organization_name}</p>
                <p><strong>Target Audience:</strong> ${target_audience}</p>
                <p><strong>Experience:</strong> ${experience}</p>
                <p><strong>Status:</strong> Pending Approval</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "Event created successfully and email sent to admin", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/addUser', async (req, res) => {
    try {
        const { name, email, password, role, additionalInfo } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
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
app.put("/updateEventDate/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const { event_date } = req.body;
  
    try {
      const event = await models.Event.findByPk(eventId);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      event.event_date = event_date;
      await event.save();
  
      res.json({ message: "Event date updated successfully", event });
    } catch (error) {
      console.error("Error updating event date:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
const PORT = process.env.PORT || 5000;
models.sequelize.sync()
    .then(() => {
        server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => console.error("Error syncing database:", error));
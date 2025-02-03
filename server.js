const express = require("express");

const userRouter = require("./route/user.js");
const bookRouter = require("./route/book.js");

const app = express();

const PORT = process.env.PORT || 8081;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "testing the server"
    });
});

app.use("/users",userRouter);
app.use("/books",bookRouter);

app.get("/*", (req, res) => {
    res.status(404).json({
        message: "This Route doesn't exist"
    })
})

app.listen(PORT, () => {
    console.log(`server is running successfully on the ${PORT}`);
})
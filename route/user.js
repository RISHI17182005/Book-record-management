const express = require("express");

const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: None
 */

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get single user by their id
 * Access: Public
 * Parameters: Id
 */

router.get("/:id", (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;

    const user = users.find((each) => each.id === id);
    if (user) {
        res.status(200).json({
            success: true,
            message: "user found",
            data: user
        })
    }
    else {
        res.status(404).json({
            success: false,
            meassage: "user doesn't exist"
        })
    }
})

/**
 * Route: /users
 * Method: POST
 * Description: Creating a new user
 * Access: Public
 * Parameters: None
 */

router.post("/", (req, res) => {
    const { id, name, surname, email, issuedBook, issuedDate, returnDate, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);
    if (user) {
        res.status(404).json({
            success: false,
            message: "user already exists"
        })
    }
    else {
        users.push({ id, name, surname, email, issuedBook, issuedDate, returnDate, subscriptionType, subscriptionDate })

        res.status(201).json({
            success: true,
            message: "User Created",
            data: users
        })
    }
})

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating a user by their id
 * Access: Public
 * Parameters: ID
 */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User doesn't exist"
        })
    }

    const updateUserData = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data
            };
        }
        return each;
    })
    return res.status(200).json({
        success: true,
        message: "updated successfully",
        data: updateUserData
    })
}
)

/**
 * Route: /:id
 * Method: DELETE
 * Description: Deleting a user by their id
 * Access: Public
 * Parameters: ID
 */

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);
    if (user) {
        const index = users.indexOf(user);
        users.splice(index, 1);
        res.status(200).json({
            success: true,
            message: "user deleted",
            data: users
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: "user doesn't exist"
        })
    }
})

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user Subscription Details
 * Access: Public
 * Parameters: ID
 */

router.get("/subscription/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user doesn't exist"
        })
    }

    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        }
        else {
            date = new Date(data);
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        }
        else if (user.subscriptionType === "Standard") {
            date = date + 180;
        }
        else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    // Jan 1 1970 UTC

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        isSubscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration:
            subscriptionExpiration <= currentDate
                ? 0
                : subscriptionExpiration - currentDate,

        fine:
            returnDate < currentDate
                ? subscriptionDate < currentDate
                    ? 100
                    : 50
                : 0
    };
    return res.status(200).json({
        success:true,
        message:"Subscription details of the user is",
        data
    })
})

module.exports = router;
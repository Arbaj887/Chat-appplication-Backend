const router = require("express").Router();

const messagesDetails = require('../models/message.model.js'); // Changed messages to Message to avoid confusion

router.post('/getMessage', async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await messagesDetails.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender === from,
                message: msg.message.text,
            };
        });
        return  res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
});

router.post('/sendMessage', async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messagesDetails.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
 
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;

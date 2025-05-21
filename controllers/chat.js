const Message = require('../modules/message');
const logger = require('../config/logger');

const saveMessageToDB = async (data)=>{
    const newMessage = new Message({
        sender: data.sender,
        owner: data.owner,
        content: data.content,
    });

    try {
        await newMessage.save();
        logger.info('Message saved successfully.');
    }
    catch(err){
        logger.error("Error saving data to Database: ", err);
    }
};

module.exports = (io) =>{
    io.on('connection', (socket) => {
        socket.on('send_message', async (data) => {
            await saveMessageToDB(data);

            //phat tin nhan cho cac may
            io.emit('receive_message', data);
        });

        socket.on('receive_message', async (data) => {
            await saveMessageToDB(data);
        });

        socket.on('disconnect', () =>{
            logger.info('User disconnected from chat controller: ', socket.id);
        });
    })
};

module.exports.getMessages = async (req, res) =>{
    const { user } = req.body;

    try{
        const messages = await Message.find({owner: user.id_owner})
            .populate('sender')
            .populate('owner')
            .sort({createdAt: 1});
        res.json(messages);
    }
    catch(err){
        logger.error('Error fetching messages:', err.message);
        res.status(500).json({ error: err.message });
    }
};
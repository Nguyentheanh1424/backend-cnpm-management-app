const Message = require('../modules/Message');

const saveMessageToDB = async (data)=>{
    const newMessage = new Message({
        sender: data.sender,
        owner: data.owner,
        content: data.content,
    });

    try {
        await newMessage.save();
        console.log('Message saved successfully.');
    }
    catch(err){
        console.error("ERROR saving data to DB: ",err);
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
            console.log('User disconnected from chat controller: ', socket.id);
        });
    })
};


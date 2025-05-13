const Events = require('../modules/event');

//Api post , tao su kien moi

const createEvent = async (req, res) => {
    console.log(req.body);

    const {task , employee, start_time, end_time, id_owner}  = req.body;

    if(!task || !employee || !start_time || !end_time || !id_owner){
        return res.status(400).json({error: 'Missing required fields'});
    }

    try{
        //Tao su kien
        const newEvent = new Events({
            task,
            employee,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            id_owner,
        });

        await newEvent.save();
        res.status(201).json({message: "Event created ", event: newEvent});
    }
    catch(err){
        console.error("Error creating event", err);
        res.status(500).json({message: "Error creating event", errors: err});
    }
};

const getEvent = async (req, res) => {
    const userId = req.query.userId;
    const events = await Events.find({id_owner: userId});


}


module.exports = {
    createEvent,
}
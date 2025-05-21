const Events = require('../modules/event');
const logger = require('../config/logger');

//Api post , tao su kien moi

const createEvent = async (req, res) => {
    logger.info(`Creating new event: ${JSON.stringify(req.body)}`);

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
        logger.error("Error creating event", err);
        res.status(500).json({message: "Error creating event", errors: err});
    }
};

const getEvent = async (req, res) => {
    try{
        const userId = req.query.userId;
        const events = await Events.find({id_owner: userId});

        const formattedEvents = events.map(event => ({
            id: event._id,
            task: event.task,
            employee: event.employee,
            start_time: event.start_time,
            end_time: event.end_time,
            id_owner: event.owner,
            createdAt: event.start_time,
        }));

        res.json(formattedEvents);
    }
    catch(error){
        logger.error("Error getting event", error);
        res.status(500).json({message: "Error getting event", errors: error});
    }
}

const deleteEvent = async (req, res) => {
    try{
        const {id} = req.params;
        const {id_owner} = req.query;
        const deletedEvent = await Events.findOneAndDelete({_id: id, id_owner});

        if (!deletedEvent) {
            return res.status(404).json({error: 'No event with id ' + id_owner});
        }

        return res.status(200).json({message: "Event deleted successfully",deletedEvent});
    }
    catch(error) {
        logger.error("Error deleting event", error);
        res.status(500).json({message: "Error deleting event", errors: error});
    }
};


const updateEvent = async (req, res) => {
    try{
        const {id} = req.params;
        const {task, employee, start_time, end_time, id_owner} = req.body;

        if (!task || !employee || !start_time || !end_time || !id_owner) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        const updateEvent = await Events.findByIdAndUpdate(
            id,
            {task, employee, start_time, end_time, id_owner},
            {new: true}
        );

        if (!updateEvent) {
            return res.status(404).json({error: 'No event with id ' + id_owner});
        }

        res.status(404).json({error: 'Event updated successfully'});
    }
    catch(error) {
        logger.error("Error updating event", error);
        res.status(500).json({message: "Error deleting event", errors: error});
    }

}

module.exports = {
    createEvent,
    getEvent,
    deleteEvent,
    updateEvent,
};

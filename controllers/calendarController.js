const Events = require('../modules/event');

//Api post , tao su kien moi

const createEvent = async (req, res) => {
    console.log(req.body);

    const {task , employee, start_time, end_time, id_owner}  = req.body;

    if(!task || !employee || !start_time || !end_time || !id_owner){
        return res.status(400).json({error: 'Missing required fields'});
    }


};
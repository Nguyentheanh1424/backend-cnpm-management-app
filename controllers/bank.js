const Banks = require('../modules/bank');

const getBank = async (req, res) => {
    const {user} = req.body;
    const bankAccounts = await Banks.find({owner: user.id_owner});

    res.status(200).json(bankAccounts);
};

const addBank = async (req, res) => {
    try{
        const {user, newPr} = req.body;

        const bankAccount = new Banks({
            owner: user.id,
            ...newPr,
        })

        await bankAccount.save();
        return res.status(201).json({message: 'Successfully add bank account'});
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }

};

const deleteBank = async (req, res) => {
    try{
        const {user, accountNumber, bankName} = req.body;
        console.log(user, accountNumber, bankName);

        if (!accountNumber || !bankName || !user) {
            return res.status(400).json({message: 'Invalid input data'});
        }

        const deleteBank = await Banks.findOneAndDelete({
            owner: user.id,
            accountNumber: accountNumber,
            bankName: bankName,
        });

        if (!deleteBank) {
            return res.status(404).json({message: 'Account not found'});
        }

        return res.status(200).json({message: 'Successfully delete bank account'});
    }
    catch (error) {
        console.error('Error while deleting bank account');
        return res.status(500).json({message: error.message});
    }
};

module.exports = {
    getBank,
    addBank,
    deleteBank
}

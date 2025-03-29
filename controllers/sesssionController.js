const {
    getPaginatedSessions,
    validateSessionCreation,
    createSession
  } = require('../services/sessionService');

const getSessions = async (req, res) => {
    const {page}=req.params
    try{
        const sessions = await getPaginatedSessions(page);
        res.status(200).json(sessions);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'erreur lors de la récupération des sessions' });
    }
}

const createSession = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.body;
        
        if (!type || !startDate || !endDate) {
            return res.status(400).json({ error: 'Veuillez fournir tous les champs requis' });
        }
        
        await validateSessionCreation(type, startDate);

        const newSession = await createSession(type, startDate, endDate);
        res.status(201).json(newSession);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erreur lors de la création de la session' });
    }
}



module.exports = {
    getSessions,
    createSession,
}
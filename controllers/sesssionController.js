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
    const { type, startDate, endDate } = req.body
    const MIN_PREPARATION_TIME = 14 * 24 * 60 * 60 * 1000
    try {

      
        if (!type || !startDate || !endDate) {
            return res.status(400).json({ error: 'Veuillez fournir tous les champs requis' });
        }
        const now = new Date()
        const minStartDate = new Date(now.getTime() + MIN_PREPARATION_TIME)
        if (new Date(startDate) < minStartDate) {
            return res.status(400).json({
              error:`La session doit commencer au moins 2 semaines après aujourd'hui (${minStartDate.toLocaleDateString()})`
            });
          }
          if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ error: 'La date de début doit être inférieure à la date de fin' });
        }
        const MIN_DURATION = 7 * 24 * 60 * 60 * 1000
        const MAX_DURATION = 21 * 24 * 60 * 60 * 1000
        
        const duration = new Date(endDate) - new Date(startDate)
        if (duration < MIN_DURATION) {
            return res.status(400).json({
              error: `La session doit durer au moins 1 semaine (actuellement ${duration / (24 * 60 * 60 * 1000)} jours)`
            });
          }
        
        if (duration > MAX_DURATION) {
            return res.status(400).json({
              error: `La session ne peut excéder 3 semaines (actuellement ${duration / (24 * 60 * 60 * 1000)} jours)`
            });
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
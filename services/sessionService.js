const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { itemPerPage } = require('../config/settings');

const getPaginatedSessions = async (page) => {
  return prisma.session.findMany({
    take: itemPerPage,
    skip: (page - 1) * itemPerPage,
  });
};

const validateSessionCreation = async (sessionType, startDate) => {
  const year = new Date(startDate).getFullYear();
  
  const existingSession = await prisma.session.findFirst({
    where: {
      session_type:sessionType,
      date_debut: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    }
  });
  if (existingSession) {
    throw new Error(`Une session de type ${sessionType} existe déjà pour ${year}`);
  }

  const existingUnvalidated = await prisma.session.findFirst({
    where: { is_validated: false }
  });
  if (existingUnvalidated) {
    throw new Error('Une session non validée existe déjà');
  }
};

const createSession = async (sessionType, startDate, endDate) => {
  return prisma.session.create({
    data: { session_type: sessionType, date_debut: startDate, date_fin: endDate }
  });
};

const getCurrentSession = async () => {
  return prisma.session.findFirst({
    where: {
      is_validated:false
    }
  });
}

module.exports = {
  getPaginatedSessions,
  validateSessionCreation,
  createSession,
  getCurrentSession,
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { itemPerPage } = require('../config/settings');

const getPaginatedSessions = async (page) => {
  return prisma.session.findMany({
    take: itemPerPage,
    skip: (page - 1) * itemPerPage,
  });
};

const validateSessionCreation = async (type, startDate) => {
  const year = new Date(startDate).getFullYear();
  
  const existingSession = await prisma.session.findFirst({
    where: {
      type,
      startDate: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    }
  });
  if (existingSession) {
    throw new Error(`Une session de type ${type} existe déjà pour ${year}`);
  }

  const existingUnvalidated = await prisma.session.findFirst({
    where: { validated: false }
  });
  if (existingUnvalidated) {
    throw new Error('Une session non validée existe déjà');
  }
};

const createSession = async (type, startDate, endDate) => {
  return prisma.session.create({
    data: { type, startDate, endDate }
  });
};

const getSessionById = async (id) => {
  return prisma.session.findUnique({
    where: {
      session_id: id,
    },
  });
}


module.exports = {
  getPaginatedSessions,
  validateSessionCreation,
  createSession,
  getSessionById,
};
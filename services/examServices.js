const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings')

const getExams=async(page,session_id)=>{
    return  prisma.exam.findMany({
                where:{
                  session_id:session_id
                },
                select:{
                  exam_id:true,
                  exam_date:true,
                  duration:true,
                  subject:{
                    select:{
                        name:true,
                        coefficient:true,
                        department_id:true,
                        filiere_name:true,
    
                    }
                  },
                  examroom:{
                    select:{
                        start_time:true,
                        end_time:true,
                        room:{
                            select:{
                                room_name:true,
                            }
                        }
                    }
                  },
            
                },
                take:itemPerPage,
                skip:itemPerPage * (page-1)
              });
}

const getExamById=async(id)=>{
    return prisma.exam.findUnique({
        where:{
          exam_id:id,
        },
        select:{
          exam_id:true,
          exam_date:true,
          duration:true,
          subject:{
            select:{
                name:true,
                coefficient:true,
                department_id:true,
                filiere_name:true,
            }
          },
          examroom:{
            select:{
                start_time:true,
                end_time:true,
                room:{
                    select:{
                        room_name:true,
                    }
                }
            }
          },
    
        },
      });
}

module.exports={
    getExams,
    getExamById,
}
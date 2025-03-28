const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings')
const {addLog} =require('../services/schedulelogService')

// exams controllers

const getAllExams = async (req, res) => {
  const {page}=req.params
    try {
        // const exams = await prisma.exam.findMany();  // Fetch tous les utilisateurs
        // res.json(exams);  // Retourner les utilisateurs en format JSON
        const exams= await prisma.exam.findMany({
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
          console.log(exams);
          res.status(200).json(exams);
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
      }
}

const getExamById=async(req,res)=>{
  const {id}=req.params
  try {
    const exam= await prisma.exam.findUnique({
        where:{
          exam_id:parseInt(id)
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
      res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de cet examen' });
  }
}

const getExamsByRoomId = async (req, res) => {
  const { room_id, } = req.params;
  try{
    const exams = await prisma.examroom.findMany({
      where: {
        room_id: parseInt(room_id),
      },
      select:{
        start_time:true,
        end_time:true,
        exam_id:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                filiere_name:true,
              }
            }
          }
        }
      }
    });
    
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getExamsBySupervisorId = async (req, res) => {
  const { supervisor_id } = req.params;
  try{
    const exams = await prisma.supervisorexam.findMany({
      where: {
        supervisor_id: parseInt(supervisor_id),
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      }
    })
    console.log(exams)
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getAllAssignedExams = async (req, res) => {
  try{
    const exams = await prisma.supervisorexam.findMany({
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      }
    })
    console.log(exams)
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  } 
}

const getNotReservedExams = async (req, res) => {
    try {
        const exams= await prisma.exam.findMany({
            select:{
              exam_id:true,
              exam_date:true,
              duration:true,
              subject:{
                select:{
                    name:true,
                    coefficient:true,
                    filiere_name:true,
                }
              },
              examroom:true,
            },
          });
          const notReservedExams = exams.filter(exam => exam.examroom === null);
          res.status(200).json(notReservedExams);
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
      }
}

const getExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
        
    })
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        exam: { 
          subject: {
            department_id: dep.department_id

          }
        },
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        validated_by_hod:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(dep,exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getNotValidatedExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
    })
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        exam: { 
          subject: {
            department_id: dep.department_id  
          }
        },
        validated_by_hod: false,
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getValidatedExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
    })
    console.log(dep)
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        AND: [
          {
            exam: {
              subject: {
                department_id: dep.department_id
              }
            }
          },
          {
            validated_by_hod: true
          }
        ]
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

// const getNotValidatedExamsByDirector = async (req, res) => {
//   try{
//     const exams = await prisma.supervisorExam.findMany({
//       where: {
//         validated_by_director: false,
//       },
//       select:{
//         FkTeacher:{
//           select:{
//             FkUser:{
//               select:{
//               name:true
//               }
//           }

//           }
//         },
//         fKExam:{
//           select:{
//             FkSubject:{
//               select:{
//                 name:true
//               }
//             }
//           }
//         }
//       }
//     });
//     res.status(200).json(exams);
//   }catch{
//     res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
//   }
// }

// const getValidatedExamsByDirector = async (req, res) => {
//   try{
//     const exams = await prisma.supervisorExam.findMany({
//       where: {
//         validated_by_director: true,
//       },
//     });
//     res.status(200).json(exams);
//   }catch{
//     res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
//   }
// }

const getPlanningForDirector = async (req, res) => {
  const {page}=req.params
  try{
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        validated_by_director:false
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        validated_by_hod:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                department_id:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const createExam = async (req, res) => {
    const { subject_id, exam_date, duration, email } = req.body;  // Récupérer les données du corps de la requête
  
    try {
      // Démarrer la transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Recherche d'un examen avec le même sujet
        const duplicate = await prisma.exam.findFirst({
          where: {
            subject_id: parseInt(subject_id),
          },
});
  
        console.log('Duplicate exam:', duplicate);
  
        let is_duplicate = false;
        if (duplicate) {
          is_duplicate = true;
          // Mise à jour de l'examen existant
          const updateExams = await prisma.exam.update({
            where: {
              exam_id: duplicate.exam_id, // Utilise exam_id pour la mise à jour
            },
            data: {
              is_duplicate: is_duplicate,
            },
          });
  
          console.log('Updated exam:', updateExams);
        }
  
        // Création de l'examen
        const exam = await prisma.exam.create({
          data: {
            exam_date:new Date(exam_date).toISOString(),
            is_duplicate,
            duration,
            subject: {
              connect: {
                subject_id: parseInt(subject_id),
              },
            },
          },
        });
        return exam
      });
      const user_id=await prisma.user.findFirst({
        where:{
          email:email
        },
        select:{
          user_id:true
        }
      })
      const subjectInfo=await prisma.subject.findUnique({
        where:{
          subject_id:parseInt(subject_id)
        },
        select:{
          name:true,
          filiere_name:true
        }
      })
      const log={
        action:"Ajout",
        description:`un examen pour le sujet ${subjectInfo.name} de la filiere ${subjectInfo.filiere_name} a été créé`,
        performed_by:user_id.user_id
      }
      await addLog(log);
      res.status(201).json(result);  // Retourner l'examen créé
    } catch (error) {
      console.error('Error creating exam:', error); // Afficher l'erreur
      res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'examen' });
    }
}

const updateExam = async (req, res) => {
    const { exam_id } = req.params;
    const { exam_date} = req.body;
    try{
      const verifyConflict = await prisma.examroom.findFirst({
        where: {
          exam_id: parseInt(exam_id),
        },
        select:{
          start_time:true,
          end_time:true,
          room_id:true
        }
      })

      if(verifyConflict){
        const isReserved = await prisma.examroom.findFirst({
          where:{
            AND: [
              {room_id:verifyConflict.room_id},
              { NOT: { exam_id: parseInt(exam_id) }},
              {
                OR: [
                    // Cas 1: Nouvel examen commence pendant un examen existant
                    {
                        start_time: { lt: verifyConflict.end_time },
                        end_time: { gt: verifyConflict.start_time }
                    },
                    // Cas 2: Nouvel examen contient complètement un examen existant
                    {
                        start_time: { gte: verifyConflict.start_time },
                        end_time: { lte: verifyConflict.end_time }
                    }
                ]
            }
            ],
          },
          select:{
            room:{
              select:{
                room_name:true
              }
            }
          }
        })
        console.log(isReserved)
        if(isReserved){
          return res.status(409).json({
            error: "La salle "+isReserved.room.room_name+ " affectée à cet examen est déjà réservée pour cet horaire.",
          });
        }
      }
      const updatedExam = await prisma.exam.update({
        where: {
          exam_id: parseInt(exam_id),
        },
        data: {
          exam_date:new Date(exam_date).toISOString(),
        },
        select:{
          subject:{
            select:{
              name:true,
              filiere_name:true,
            }
          },
          exam_id:true,
          exam_date:true,
        }
      });
      if(updatedExam){
        const user_id=await prisma.user.findFirst({
          where:{
            role:"ADMIN"
          },
          select:{
            user_id:true
          }
        })
        const log={
          action:"Modification",
          description:`un examen pour le sujet ${updatedExam.subject.name} de la filiere ${updatedExam.subject.filiere_name} a été modifié`,
          performed_by:user_id.user_id
        }
        await addLog(log);
      }
      console.log(updatedExam)
    res.status(201).json(updatedExam);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Une erreur est survenue lors de la modification de l\'examen' });
    }

}

const deleteExam = async (req, res) => {
    const { exam_id } = req.params;
    try{
      const result = await prisma.$transaction(async (prisma) => {
          // Suppression de l'entrée dans ExamRoom
          await prisma.examroom.deleteMany({
            where: { exam_id: parseInt(exam_id) }
          });

          // Suppression des entrées dans SupervisorExam (si applicable)
          await prisma.supervisorexam.deleteMany({
            where: { exam_id: parseInt(exam_id) }
          });

          // Suppression de l'examen
          const deletedExam=await prisma.exam.delete({
            where: { exam_id: parseInt(exam_id) },
            select:{
              subject:{
                select:{
                  name: true,
                  filiere_name: true
                }
              }
            }
          });
          return deletedExam;
      });
      if(result){
        const user_id=await prisma.user.findFirst({
          where:{
            role:"ADMIN"
          },
          select:{
            user_id:true
          }
        })
        const log={
          action:"Suppression",
          description:`un examen pour le sujet ${result.subject.name} de la filiere ${result.subject.filiere_name} a été supprimé`,
          performed_by:user_id.user_id
        }
        await addLog(log);
      }
      res.status(201).json({message:"exam deleted"});  // Retourner l'examen créé
    }catch(err){
      console.log(err)
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'examen' });
    }
}

module.exports = {
    getAllExams,
    getExamById,
    getExamsByRoomId,
    getExamsBySupervisorId,
    createExam,
    updateExam,
    deleteExam,
    getNotReservedExams,
    getExamsByDeaprtment,
    getNotValidatedExamsByDeaprtment,
    getValidatedExamsByDeaprtment,
    getAllAssignedExams,
    // getNotValidatedExamsByDirector,
    // getValidatedExamsByDirector,
    getPlanningForDirector
}





// async function main() {
//   // ... you will write your Prisma Client queries here
  


//   //create data in the database
//     await prisma.room.create({
//         data: {
//         room_name: 'B12',
//         capacity: 25,
//         location: 'block B 1er etage',
//         is_available: false,
//         }
//     })

//   //fetch data from the database
//   const allRooms = await prisma.room.findMany()
//   console.log(allRooms)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
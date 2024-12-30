import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { taskBelongToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router()

router.use(authenticate)

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El Nombre del Projecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Description del Projecto es Obligatorio'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del Projecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Description del Projecto es Obligatorio'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/** Router for Tasks */
router.param('projectId', projectExist)

router.param('taskId', taskExist)
router.param('taskId', taskBelongToProject)

router.post('/:projectId/task',
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Description de la tarea es Obligatorio'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/task', 
    TaskController.getProjectTask
)

router.get('/:projectId/task/:taskId', 
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/task/:taskId', 
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Description de la tarea es Obligatorio'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/task/:taskId', 
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/task/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es Obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

/**Router for Teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById

)

export default router
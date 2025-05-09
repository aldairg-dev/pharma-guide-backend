import { Router } from "express";
import { AccessController } from "../controller/access.controller";

const routerUser = Router();
const userController = new AccessController();

/* 
  #swagger.tags = ['Access']
  #swagger.path = '/api/access/pharma-guide/register'
  #swagger.method = 'post'
  #swagger.description = 'Registro de un nuevo usuario en la plataforma.'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Datos necesarios para crear el usuario',
    required: true,
    schema: {
      $email: 'usuario@correo.com',
      $password: '123456',
      name: 'Juan Pérez'
    }
  }
  #swagger.responses[201] = {
    description: 'Usuario creado correctamente',
    schema: { message: 'Usuario registrado exitosamente', userId: 1 }
  }
  #swagger.responses[400] = {
    description: 'Datos inválidos o usuario ya existente',
    schema: { error: 'Correo ya registrado' }
  }
*/
routerUser.post("/register", userController.register.bind(userController));

/* 
  #swagger.tags = ['Access']
  #swagger.path = '/api/access/pharma-guide/login'
  #swagger.method = 'post'
  #swagger.description = 'Inicio de sesión de un usuario registrado.'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Credenciales del usuario',
    required: true,
    schema: {
      $email: 'usuario@correo.com',
      $password: '123456'
    }
  }
  #swagger.responses[200] = {
    description: 'Login exitoso',
    schema: { token: 'jwt.token.ejemplo' }
  }
  #swagger.responses[401] = {
    description: 'Credenciales inválidas',
    schema: { error: 'Correo o contraseña incorrectos' }
  }
*/
routerUser.post("/login", userController.login.bind(userController));

export default routerUser;

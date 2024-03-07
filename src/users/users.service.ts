/* 
? Estas líneas importan los módulos y clases necesarios para definir un servicio en NestJS y trabajar con Mongoose, una librería de modelado de objetos para MongoDB.
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

/* 
? @Injectable() es un decorador de NestJS que se utiliza para marcar una clase como un servicio. Esto le permite a NestJS inyectar dependencias en esta clase cuando sea necesario.⬇️
*/
@Injectable()
/* 
? Se define la clase UsersService, que es el servicio que proporcionará funcionalidades relacionadas con los usuarios.⬇️
*/
export class UsersService {
  /* 
    ? Este es el constructor de la clase UsersService. Toma un argumento que está decorado con @InjectModel(). Esto indica que NestJS debe inyectar el modelo User de Mongoose en esta clase. private readonly userModel: Model<User> es una forma de definir una propiedad privada llamada userModel en la clase que contendrá el modelo User.⬇️
    */
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }
  /* 
? findAll() es un método de la clase UsersService. Retorna una promesa que resuelve en un array de objetos User. Dentro de este método, se llama al método find() del modelo userModel, que busca todos los documentos en la colección de usuarios en la base de datos MongoDB. exec() se utiliza para ejecutar la consulta y devolver una promesa con los resultados.⬇️
*/
  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
  }
}

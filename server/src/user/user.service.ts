import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserContentDto } from './dto/updateUserContent.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel:Model<UserDocument>) { }

    async getAllUsers(): Promise<UserDocument[]> {
        const userData = await this.userModel.find()
        if (!userData || userData.length == 0) {
            throw new NotFoundException('Users data not found!');
        }
        return userData;
    }

    async getUser(userId: string): Promise<UserDocument> {
        const userData = await this.userModel.findById(userId);
        if (!userData) {
            throw new NotFoundException('User data not found!');
        }
        return userData;
    }

    // FUNCTION FOR CHECKING USER LOGIN
    async findUser(username: string): Promise<UserDocument> {
        const userData = this.userModel.findOne({ username: username });
        if (!userData) {
            throw new NotFoundException('User data not found!');
        }
        return userData;
    }

    async checkExistingUser(username: string): Promise<UserDocument[]> {
        const usernameRegex = new RegExp('^' + username + '$','i');
        const userData = await this.userModel
        .find({ $or: 
            [ 
                { username: usernameRegex }
            ]
        });
        if (!userData || userData.length == 0) {
            throw new NotFoundException('User data not found!');
        }
        return userData;
    }

    async createUser(userDto: CreateUserDto ): Promise<UserDocument> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds);
        userDto.password = hashedPassword;
        const newUser = await this.userModel.create(userDto);
        if (!newUser) {
            throw new NotFoundException('Could not create user!');
        }
        return newUser;
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        if(updateUserDto.password != undefined){
            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(updateUserDto.password, saltOrRounds);
            updateUserDto.password = hashedPassword;   
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
        if (!updatedUser) {
            throw new NotFoundException('User data not found!');
        }
        return updatedUser;
    }

    async updateUserContent(userId: string, updateUserContentDto: UpdateUserContentDto) {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, {library: updateUserContentDto.library},  { new: true });
        if (!updatedUser) {
            throw new NotFoundException('User data not found!');
        }
        return updatedUser;
    }

    async deleteUser(userId: string): Promise<UserDocument> {
        const deletedUser = await this.userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new NotFoundException(`User #${userId} not found`);
        }
        return deletedUser;
    }
}

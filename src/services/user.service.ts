import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { User } from "@prisma/client";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import config from "../config/env";

const SALT_ROUNDS = 10;

const firebaseConfig = {
  apiKey: config.firebaseAPIKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.fireBaseProjectId,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessageSenderId,
  appId: config.firebaseAppId,
  measurementId: config.firebaseMeasurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signup = async (userData: CreateUserDto) => {
  try {
    const firebaseUser = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const userDataToSave: CreateUserDto = {
      ...userData,
      id: firebaseUser.user.uid,
      password: hashedPassword,
    };

    const dbUser = await createUser(userDataToSave);

    return {
      token: "Bearer " + (await firebaseUser.user.getIdToken()),
    };
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const login = async (loginData: LoginUserDto) => {
  try {
    const firebaseUser: UserCredential = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    );

    const dbUser = await findUserById(firebaseUser.user.uid);

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      dbUser.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      token: "Bearer " + (await firebaseUser.user.getIdToken()),
    };
  } catch (error: any) {
    throw new Error(`Failed to login: ${error.message}`);
  }
};

const createUser = async (userData: CreateUserDto): Promise<User> => {
  return prisma.user.create({
    data: userData,
  });
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getUsersOfClient = async (clientId: string) => {
  const users = await prisma.user.findMany({
    where: {
      orders: {
        some: {
          orderItems: {
            some: {
              product: {
                clientId,
              },
            },
          },
        },
      },
    },
    select: {
      orders: {
        select:{id:true}
      },
      name:true,
      phoneNumber:true,
      email:true
    },
  });
  return users;
};

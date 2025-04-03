import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { CreateClientDto } from "../dto/create-client.dto";
import { LoginClientDto } from "../dto/login-client.dto";
import { Client } from "@prisma/client";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import config from "../config/env";
import { FirebaseDataDto } from "../dto/firebase-data.dto";
import { firebaseData } from "@prisma/client";

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

export const signup = async (clientData: CreateClientDto) => {
  try {
    const firebaseClient = await createUserWithEmailAndPassword(
      auth,
      clientData.email,
      clientData.password
    );

    const hashedPassword = await bcrypt.hash(clientData.password, SALT_ROUNDS);

    const clientDataToSave: CreateClientDto = {
      ...clientData,
      id: firebaseClient.user.uid,
      password: hashedPassword,
    };

    const dbClient = await createClient(clientDataToSave);

    return {
      token: "Bearer " + (await firebaseClient.user.getIdToken()),
    };
  } catch (error: any) {
    throw new Error(`Failed to create client: ${error.message}`);
  }
};

export const login = async (loginData: LoginClientDto) => {
  try {
    console.log("reached inside login service");
    const firebaseClient: UserCredential = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    );
    const id = firebaseClient.user.uid;
    console.log("id", id);
    const dbClient = await findClientById(firebaseClient.user.uid);
    if (!dbClient) {
      throw new Error("Client not found in database");
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      dbClient.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return {
      token: "Bearer " + (await firebaseClient.user.getIdToken()),
    };
  } catch (error: any) {
    throw new Error(`Failed to login: ${error.message}`);
  }
};

const createClient = async (clientData: CreateClientDto): Promise<Client> => {
  return prisma.client.create({
    data: clientData,
  });
};

const findClientByEmail = async (email: string): Promise<Client | null> => {
  return prisma.client.findUnique({
    where: { email },
  });
};

const findClientById = async (id: string): Promise<Client | null> => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

export const addFirebaseData = async (
  clientId: string,
  firebaseData: FirebaseDataDto
): Promise<firebaseData> => {
  try {
    const client = await findClientById(clientId);

    if (!client) {
      throw new Error("Client not found");
    }

    const existingFirebaseData = await findFirebaseDataByClientId(clientId);

    if (existingFirebaseData) {
      throw new Error("Firebase data already exists for this client");
    }

    const newFirebaseData = await prisma.firebaseData.create({
      data: {
        ...firebaseData,
        clientId: client.id,
      },
    });

    return newFirebaseData;
  } catch (error: any) {
    throw new Error(`Failed to add Firebase data: ${error.message}`);
  }
};

const findFirebaseDataByClientId = async (
  clientId: string
): Promise<firebaseData | null> => {
  return prisma.firebaseData.findUnique({
    where: { clientId },
  });
};

export const getFirebaseData = async (clientId: string) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { firebaseData: true },
    });

    if (!client || !client.firebaseData) {
      return null;
    }

    return client.firebaseData;
  } catch (error: any) {
    return null;
  }
};

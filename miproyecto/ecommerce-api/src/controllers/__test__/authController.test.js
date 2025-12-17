import bcrypt from "bcrypt";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import User from "../../models/user.js";
import { register } from "../authController.js";

describe("AuthController Prueba para el registro y login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // afterEach(() => {
  // });
  // afterAll(() => {
  // });
  // beforeAll(() => {
  // });
  describe("register, Registro de usuarios", () => {
    it("Deberia crear un nuevo usuario", async () => {
      const mockUser = {
        displayName: "finux",
        email: "finux@finux.com",
        password: "finux123",
        phone: "1234567890",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword123");

      const mockSaveUser = jest.fn().mockResolvedValue({
        _id: "user123",
        displayName: mockUser.displayName,
        email: mockUser.email,
        role: "guest",
        phone: mockUser.phone,
      });

      jest.spyOn(User.prototype, "save").mockImplementation(mockSaveUser);

      const req = {
        body: mockUser,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockSaveUser).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        displayName: mockUser.displayName,
        email: mockUser.email,
        phone: mockUser.phone,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deberia rechazar el registro si el email ya existe", async () => {
      const existingUser = {
        displayName: "Usuario Existente",
        email: "existente@example.com",
        password: "password123",
        phone: "9876543210",
      };

      jest.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'existingUserId',
        email: existingUser.email,
        displayName: existingUser.displayName
      });
       const req = {
        body: existingUser
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: existingUser.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'User already exist' 
      });
      
      expect(next).not.toHaveBeenCalled();
    });
  });

  // describe("login, login de los usuarios");
});

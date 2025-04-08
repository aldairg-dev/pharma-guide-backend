import bcrypt from "bcrypt";

export const bcryptService = {
  encryptPassword: async (plainPassword: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  },

  comparePasswords: async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  },
};

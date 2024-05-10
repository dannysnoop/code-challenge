import * as bcrypt from 'bcrypt';
export const hashPassword = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

export const comparePassword = (hashPassword: string, password: string) => {
  return bcrypt.compareSync(password, hashPassword); // t
};

export const regexPassword = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

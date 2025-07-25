import { validate } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

describe('CreateUserDTO', () => {
  let dto = new CreateUserDTO();
  beforeEach(() => {
    dto = new CreateUserDTO();
    dto.name = 'mohamed';
    dto.email = 'test@test.com';
    dto.password = '123456A#';
  });

  const passwordValidator = async (password: string, message: string) => {
    dto.password = password;
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();
    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain(message);
  };

  it('should validate complete valid data ', async () => {
    //act on the data
    const errors = await validate(dto);
    //assert the condition u got in mind
    expect(errors.length).toBe(0);
  });
  it('should validate wrong email', async () => {
    dto.email = 'test';
    const errors = await validate(dto);
    //console.log(errors);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
  it('should fail if the password lacks one capital letter ', async () => {
    await passwordValidator('abcdef', 'must have 1 upper case letter');
  });
  it('should fail if it doesnt contain atleast one number', async () => {
    await passwordValidator('Abcdef', 'must have 1 number');
  });
  it('should fail if it doesnt contain atleast special character', async () => {
    await passwordValidator('Abcdef1', 'must have 1 special character');
  });
});

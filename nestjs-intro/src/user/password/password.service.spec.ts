import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // hash()
  // plain text -> hash
  // for the same input -> the same output
  // 12345678 -> skjdskdjskdjskf83u8rye
  // ------------
  // bcrypt.hash -> was called
  //             -> password was passed to it & salt rounds
  // mocks & spies

  it('should hash the password', async () => {
    const mockHash = 'hashedPassword';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = '123456';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });
  it('should correctly verify the password', async () => {
    const result = true;
    (bcrypt.compare as jest.Mock).mockResolvedValue(result);
    const password = '123456';
    const hashed = '1234567';
    const verifyResult = await service.verify(password, hashed);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashed);
    expect(verifyResult).toBe(result);
  });
  it('should correctly verify the  wrong password', async () => {
    const result = false;
    (bcrypt.compare as jest.Mock).mockResolvedValue(result);
    const password = '123456';
    const hashed = '1234567';
    const verifyResult = await service.verify(password, hashed);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashed);
    expect(verifyResult).toBe(result);
  });
});

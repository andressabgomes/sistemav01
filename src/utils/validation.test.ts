import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword, 
  validateCPF, 
  validateCNPJ, 
  validatePhone,
  validateZipCode,
  validateRequired,
  validateMinLength,
  validateMaxLength
} from './validation';

describe('Validação de Email', () => {
  it('valida emails válidos', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('test+tag@example.org')).toBe(true);
  });

  it('rejeita emails inválidos', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Validação de Senha', () => {
  it('valida senhas válidas', () => {
    expect(validatePassword('Password123!').isValid).toBe(true);
    expect(validatePassword('StrongP@ss1').isValid).toBe(true);
    expect(validatePassword('MyP@ssw0rd').isValid).toBe(true);
  });

  it('rejeita senhas fracas', () => {
    expect(validatePassword('weak').isValid).toBe(false);
    expect(validatePassword('12345678').isValid).toBe(false);
    expect(validatePassword('password').isValid).toBe(false);
  });

  it('verifica requisitos mínimos', () => {
    expect(validatePassword('Abc123!@').isValid).toBe(true); // 8+ chars, maiúscula, minúscula, número, símbolo
    expect(validatePassword('Abc123').isValid).toBe(false); // sem símbolo
    expect(validatePassword('abc123!').isValid).toBe(false); // sem maiúscula
  });
});

describe('Validação de CPF', () => {
  it('valida CPFs válidos', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
    expect(validateCPF('12345678909')).toBe(true);
    expect(validateCPF('111.444.777-35')).toBe(true);
  });

  it('rejeita CPFs inválidos', () => {
    expect(validateCPF('123.456.789-10')).toBe(false);
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('000.000.000-00')).toBe(false);
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('')).toBe(false);
  });
});

describe('Validação de CNPJ', () => {
  it('valida CNPJs válidos', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('11222333000181')).toBe(true);
    expect(validateCNPJ('00.000.000/0001-91')).toBe(true);
  });

  it('rejeita CNPJs inválidos', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe(false);
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
    expect(validateCNPJ('123')).toBe(false);
    expect(validateCNPJ('')).toBe(false);
  });
});

describe('Validação de Telefone', () => {
  it('valida telefones válidos', () => {
    expect(validatePhone('(11) 99999-9999')).toBe(true);
    expect(validatePhone('11999999999')).toBe(true);
    expect(validatePhone('(11) 3333-3333')).toBe(true);
    expect(validatePhone('(11) 99999-9999')).toBe(true);
  });

  it('rejeita telefones inválidos', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('(11) 99999-999')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });
});

describe('Validação de CEP', () => {
  it('valida CEPs válidos', () => {
    expect(validateZipCode('12345-678')).toBe(true);
    expect(validateZipCode('12345678')).toBe(true);
    expect(validateZipCode('00000-000')).toBe(true);
  });

  it('rejeita CEPs inválidos', () => {
    expect(validateZipCode('123')).toBe(false);
    expect(validateZipCode('12345-67')).toBe(false);
    expect(validateZipCode('12345-6789')).toBe(false);
    expect(validateZipCode('')).toBe(false);
  });
});

describe('Validação de Campo Obrigatório', () => {
  it('valida campos preenchidos', () => {
    expect(validateRequired('texto')).toBe(true);
    expect(validateRequired('0')).toBe(true);
    expect(validateRequired('false')).toBe(true);
  });

  it('rejeita campos vazios', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
    expect(validateRequired(null)).toBe(false);
    expect(validateRequired(undefined)).toBe(false);
  });
});

describe('Validação de Tamanho Mínimo', () => {
  it('valida strings com tamanho adequado', () => {
    expect(validateMinLength('texto', 5)).toBe(true);
    expect(validateMinLength('texto longo', 5)).toBe(true);
    expect(validateMinLength('abc', 3)).toBe(true);
  });

  it('rejeita strings muito curtas', () => {
    expect(validateMinLength('abc', 5)).toBe(false);
    expect(validateMinLength('', 1)).toBe(false);
    expect(validateMinLength('texto', 10)).toBe(false);
  });
});

describe('Validação de Tamanho Máximo', () => {
  it('valida strings com tamanho adequado', () => {
    expect(validateMaxLength('texto', 10)).toBe(true);
    expect(validateMaxLength('abc', 5)).toBe(true);
    expect(validateMaxLength('', 10)).toBe(true);
  });

  it('rejeita strings muito longas', () => {
    expect(validateMaxLength('texto muito longo', 10)).toBe(false);
    expect(validateMaxLength('abcdefghijk', 10)).toBe(false);
  });
});

describe('Validações Combinadas', () => {
  it('validações combinadas', () => {
    expect(validateEmail('test@example.com') && validatePassword('Password123!').isValid).toBe(true);
  });

  it('valida dados de cliente', () => {
    const clientData = {
      email: 'client@example.com',
      phone: '(11) 99999-9999',
      cpf: '123.456.789-09',
      zipCode: '12345-678'
    };

    expect(validateEmail(clientData.email)).toBe(true);
    expect(validatePhone(clientData.phone)).toBe(true);
    expect(validateCPF(clientData.cpf)).toBe(true);
    expect(validateZipCode(clientData.zipCode)).toBe(true);
  });

  it('valida dados de empresa', () => {
    const companyData = {
      email: 'company@example.com',
      phone: '(11) 3333-3333',
      cnpj: '11.222.333/0001-81',
      zipCode: '12345-678'
    };

    expect(validateEmail(companyData.email)).toBe(true);
    expect(validatePhone(companyData.phone)).toBe(true);
    expect(validateCNPJ(companyData.cnpj)).toBe(true);
    expect(validateZipCode(companyData.zipCode)).toBe(true);
  });
});

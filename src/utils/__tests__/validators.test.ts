import { checkEmail } from '../validators';

describe('checkEmail', () => {
  describe('geçerli email adresleri', () => {
    it('standart format geçerlidir', () => {
      expect(checkEmail('test@mail.com')).toBe(true);
    });

    it('subdomain içeren format geçerlidir', () => {
      expect(checkEmail('user@sub.domain.co')).toBe(true);
    });

    it('rakam içeren kullanıcı adı geçerlidir', () => {
      expect(checkEmail('user123@example.org')).toBe(true);
    });
  });

  describe('geçersiz email adresleri', () => {
    it('boş string geçersizdir', () => {
      expect(checkEmail('')).toBe(false);
    });

    it('@işareti olmayan string geçersizdir', () => {
      expect(checkEmail('invalid')).toBe(false);
    });

    it('@.com formatı geçersizdir', () => {
      expect(checkEmail('@.com')).toBe(false);
    });

    it('sadece domain olmadan geçersizdir', () => {
      expect(checkEmail('user@')).toBe(false);
    });

    it('boşluk içeriyorsa geçersizdir', () => {
      expect(checkEmail('user @mail.com')).toBe(false);
    });
  });
});

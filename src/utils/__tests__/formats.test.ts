import { fmtKm, formatCount, fmtMin, formatDate } from '../formats';

// i18n is mocked globally in jest.setup.js — t(key) returns the key itself
// fmtMin uses: i18n.t('units.min') → 'units.min', i18n.t('units.hour') → 'units.hour'

describe('fmtKm', () => {
  it('10 km altındaki değeri 1 ondalıkla gösterir', () => {
    expect(fmtKm(1.5)).toBe('1.5 km');
  });

  it('10 km ve üzerinde ondalıksız gösterir', () => {
    expect(fmtKm(15)).toBe('15 km');
  });

  it('0 için 0.0 km döndürür', () => {
    expect(fmtKm(0)).toBe('0.0 km');
  });

  it('9.9 km 1 ondalıkla gösterilir', () => {
    expect(fmtKm(9.9)).toBe('9.9 km');
  });

  it('10.0 km ondalıksız gösterilir', () => {
    expect(fmtKm(10)).toBe('10 km');
  });
});

describe('formatCount', () => {
  it('0 → "0"', () => {
    expect(formatCount(0)).toBe('0');
  });

  it('negatif sayı → "0"', () => {
    expect(formatCount(-5)).toBe('0');
  });

  it('1000 altı sayı olduğu gibi gösterilir', () => {
    expect(formatCount(999)).toBe('999');
  });

  it('1000 → "1K"', () => {
    expect(formatCount(1000)).toBe('1K');
  });

  it('1500 → "1.5K"', () => {
    expect(formatCount(1500)).toBe('1.5K');
  });

  it('2000000 → "2M"', () => {
    expect(formatCount(2_000_000)).toBe('2M');
  });

  it('1500000 → "1.5M"', () => {
    expect(formatCount(1_500_000)).toBe('1.5M');
  });

  it('1000000000 → "1B"', () => {
    expect(formatCount(1_000_000_000)).toBe('1B');
  });
});

describe('fmtMin', () => {
  it('60 dakika altında "X units.min" döndürür', () => {
    expect(fmtMin(45)).toBe('45 units.min');
  });

  it('tam saat olduğunda sadece saat gösterilir', () => {
    expect(fmtMin(60)).toBe('1 units.hour');
  });

  it('saat ve dakika varsa ikisi de gösterilir', () => {
    expect(fmtMin(90)).toBe('1 units.hour 30 units.min');
  });

  it('0 dakika → "0 units.min"', () => {
    expect(fmtMin(0)).toBe('0 units.min');
  });

  it('2 saat tam → "2 units.hour"', () => {
    expect(fmtMin(120)).toBe('2 units.hour');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-25T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('30 saniye önce → i18n just_now key', () => {
    const date = new Date('2026-04-25T11:59:30Z').toISOString();
    expect(formatDate(date)).toBe('time.just_now');
  });

  it('5 dakika önce → i18n minutes key', () => {
    const date = new Date('2026-04-25T11:55:00Z').toISOString();
    expect(formatDate(date)).toBe('time.minutes');
  });

  it('2 saat önce → i18n hours key', () => {
    const date = new Date('2026-04-25T10:00:00Z').toISOString();
    expect(formatDate(date)).toBe('time.hours');
  });

  it('3 gün önce → i18n days key', () => {
    const date = new Date('2026-04-22T12:00:00Z').toISOString();
    expect(formatDate(date)).toBe('time.days');
  });

  it('2 hafta önce → toLocaleDateString formatı', () => {
    const date = new Date('2026-04-10T12:00:00Z').toISOString();
    const result = formatDate(date);
    // toLocaleDateString returns a date string (not an i18n key)
    expect(typeof result).toBe('string');
    expect(result).not.toBe('time.days');
  });
});

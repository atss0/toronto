import i18n from '../i18n/i18n'; // kendi yoluna göre düzelt

const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) {
    return i18n.t('time.just_now');
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return i18n.t('time.minutes', { count: mins });
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return i18n.t('time.hours', { count: hours });
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return i18n.t('time.days', { count: days });
  } else {
    return d.toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
};

const fmtKm = (km: number) => `${km.toFixed(km < 10 ? 1 : 0)} km`;
const fmtMin = (m: number) => {
  const min = i18n.t('units.min');
  const hour = i18n.t('units.hour');
  if (m < 60) return `${m} ${min}`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h} ${hour} ${rem} ${min}` : `${h} ${hour}`;
};

const formatCount = (n: number) => {
  if (n < 0) return '0';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.0','') + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0','') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0','') + 'K';
  return String(n);
};

export { formatDate, fmtKm, fmtMin, formatCount };
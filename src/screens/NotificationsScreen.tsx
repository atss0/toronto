import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import mockData from '../data/mock.json';

interface Notification {
  id: string;
  type: 'route' | 'suggestion' | 'reminder';
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = mockData.notifications as Notification[];

const typeIcon: Record<Notification['type'], string> = {
  route: 'solar:route-bold',
  suggestion: 'solar:star-bold',
  reminder: 'solar:bell-bold',
};

const typeColor: Record<Notification['type'], string> = {
  route: '#3182ED',
  suggestion: '#F59E0B',
  reminder: '#10B981',
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: wScale(70) }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Iconify icon="solar:bell-bold" size={wScale(14)} color={colors.primary} />
            <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          </View>
        )}

        {notifications.map(notif => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
            onPress={() => markRead(notif.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${typeColor[notif.type]}20` }]}>
              <Iconify icon={typeIcon[notif.type]} size={wScale(18)} color={typeColor[notif.type]} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTopRow}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                {!notif.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Iconify icon="solar:bell-off-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(16),
      paddingBottom: hScale(14),
      backgroundColor: colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
    markAllText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },

    scroll: { padding: Layout.screenPaddingH, gap: hScale(10), paddingBottom: hScale(40) },

    unreadBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(6),
      backgroundColor: colors.primaryLight,
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(8),
      borderRadius: wScale(12),
      marginBottom: hScale(4),
    },
    unreadText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },

    notifCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: wScale(12),
      backgroundColor: colors.white,
      borderRadius: wScale(16),
      padding: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
    },
    notifCardUnread: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '33' },
    iconWrap: {
      width: wScale(42),
      height: wScale(42),
      borderRadius: wScale(12),
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    notifContent: { flex: 1 },
    notifTopRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(6), marginBottom: hScale(3) },
    notifTitle: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
    unreadDot: { width: wScale(8), height: wScale(8), borderRadius: wScale(4), backgroundColor: colors.primary },
    notifBody: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(19), marginBottom: hScale(5) },
    notifTime: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },

    emptyState: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
    emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
    emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  });

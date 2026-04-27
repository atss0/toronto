import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
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
import notificationsService from '../services/notifications';

interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  time: string;
  created_at: string;
  action_type?: string;
  action_payload?: Record<string, any>;
}

const getTypeIcon = (type: string): string => {
  if (type.includes('route') || type.includes('trip')) return 'solar:route-bold';
  if (type.includes('suggest') || type.includes('gem') || type.includes('place')) return 'solar:star-bold';
  return 'solar:bell-bold';
};

const getTypeColor = (type: string): string => {
  if (type.includes('route') || type.includes('trip')) return '#3182ED';
  if (type.includes('suggest') || type.includes('gem') || type.includes('place')) return '#F59E0B';
  return '#10B981';
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    try {
      const res = await notificationsService.getAll({ page: pageNum, limit: 20 });
      const { data } = res.data;
      const fetched: ApiNotification[] = data.notifications;
      setUnreadCount(data.unread_count);
      setNotifications(prev => (append ? [...prev, ...fetched] : fetched));
      setHasNext(res.data.pagination?.hasNext ?? false);
      setPage(pageNum);
    } catch (_) {
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(1);
  };

  const loadMore = () => {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    fetchNotifications(page + 1, true);
  };

  const markRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.is_read) return;
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await notificationsService.markRead(id);
    } catch (_) {
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: false } : n)));
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await notificationsService.markAllRead();
    } catch (_) {
      fetchNotifications(1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        onScrollEndDrag={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - hScale(40)) {
            loadMore();
          }
        }}
      >
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Iconify icon="solar:bell-bold" size={wScale(14)} color={colors.primary} />
            <Text style={styles.unreadText}>
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {notifications.map(notif => {
          const icon = getTypeIcon(notif.type);
          const iconColor = getTypeColor(notif.type);
          return (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, !notif.is_read && styles.notifCardUnread]}
              onPress={() => markRead(notif.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${iconColor}20` }]}>
                <Iconify icon={icon} size={wScale(18)} color={iconColor} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTopRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {!notif.is_read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {loadingMore && (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: hScale(16) }} />
        )}

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
    centered: { alignItems: 'center', justifyContent: 'center' },

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

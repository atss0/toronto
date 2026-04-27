import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import assistantService, { ApiRouteCard } from '../services/assistant';
import routesService from '../services/routes';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; routeCard?: ApiRouteCard }
  | { id: string; role: 'typing' };

// ─── Typing Indicator ─────────────────────────────────────────────────────────

const TypingBubble: React.FC<{ colors: AppColors }> = ({ colors }) => {
  const s = useMemo(() => makeBubbleStyles(colors), [colors]);
  return (
    <View style={s.assistantRow}>
      <View style={s.assistantAvatar}>
        <Iconify icon="solar:map-point-wave-bold" size={wScale(16)} color="#FFFFFF" />
      </View>
      <View style={[s.assistantBubble, { paddingHorizontal: wScale(18), paddingVertical: hScale(14) }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    </View>
  );
};

// ─── Route Card Component ─────────────────────────────────────────────────────

const RouteCardView: React.FC<{
  card: ApiRouteCard;
  colors: AppColors;
  onSave?: () => void;
  saving?: boolean;
}> = ({ card, colors, onSave, saving }) => {
  const s = useMemo(() => makeCardStyles(colors), [colors]);
  const { t } = useTranslation();
  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerIcon}>
          <Iconify icon="solar:route-bold" size={wScale(18)} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={2}>{card.title}</Text>
          <View style={s.metaRow}>
            <Iconify icon="solar:clock-circle-linear" size={wScale(12)} color={colors.textSecondary} />
            <Text style={s.metaText}>{card.duration}</Text>
            <View style={s.metaDot} />
            <Iconify icon="solar:map-point-linear" size={wScale(12)} color={colors.textSecondary} />
            <Text style={s.metaText}>{card.distance}</Text>
            <View style={s.metaDot} />
            <Text style={s.metaText}>{card.stops.length} {t('assistant.stops', 'stops')}</Text>
          </View>
        </View>
      </View>

      <View style={s.divider} />

      {card.stops.map((stop, i) => (
        <View key={i} style={s.stopRow}>
          <View style={s.stopDotWrap}>
            <View style={s.stopDot} />
            {i < card.stops.length - 1 && <View style={s.stopLine} />}
          </View>
          <View style={s.stopInfo}>
            <Text style={s.stopName}>{stop.name}</Text>
            <Text style={s.stopDesc}>{stop.description}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[s.saveBtn, saving && s.saveBtnDisabled]}
        activeOpacity={0.85}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Iconify icon="solar:bookmark-bold" size={wScale(15)} color="#FFFFFF" />
            <Text style={s.saveBtnText}>{t('assistant.saveRoute', 'Save Route')}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeCardStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderRadius: wScale(16),
      borderWidth: 1,
      borderColor: colors.stroke,
      marginTop: hScale(10),
      overflow: 'hidden',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: wScale(12),
      padding: wScale(14),
    },
    headerIcon: {
      width: wScale(40),
      height: wScale(40),
      borderRadius: wScale(12),
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    title: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
      marginBottom: hScale(5),
      lineHeight: hScale(20),
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      flexWrap: 'wrap',
    },
    metaText: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    metaDot: {
      width: wScale(3),
      height: wScale(3),
      borderRadius: wScale(2),
      backgroundColor: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.stroke,
      marginHorizontal: wScale(14),
    },
    stopRow: {
      flexDirection: 'row',
      paddingHorizontal: wScale(14),
      paddingTop: hScale(12),
    },
    stopDotWrap: {
      alignItems: 'center',
      width: wScale(20),
      marginRight: wScale(10),
      paddingTop: hScale(3),
    },
    stopDot: {
      width: wScale(9),
      height: wScale(9),
      borderRadius: wScale(5),
      backgroundColor: colors.primary,
    },
    stopLine: {
      width: 1.5,
      flex: 1,
      minHeight: hScale(22),
      backgroundColor: colors.primaryLight,
      marginTop: hScale(4),
    },
    stopInfo: {
      flex: 1,
      paddingBottom: hScale(12),
    },
    stopName: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
      marginBottom: hScale(2),
    },
    stopDesc: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      lineHeight: hScale(16),
    },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(7),
      backgroundColor: colors.primary,
      margin: wScale(14),
      marginTop: hScale(8),
      borderRadius: wScale(14),
      paddingVertical: hScale(12),
      minHeight: hScale(44),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 3,
    },
    saveBtnDisabled: { opacity: 0.6, shadowOpacity: 0 },
    saveBtnText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
  });

// ─── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble: React.FC<{
  msg: Message;
  colors: AppColors;
  userInitials: string;
  onSaveRoute?: (card: ApiRouteCard) => void;
  savingCardId?: string;
}> = ({ msg, colors, userInitials, onSaveRoute, savingCardId }) => {
  const s = useMemo(() => makeBubbleStyles(colors), [colors]);

  if (msg.role === 'typing') {
    return <TypingBubble colors={colors} />;
  }

  if (msg.role === 'user') {
    return (
      <View style={s.userRow}>
        <View style={s.userBubble}>
          <Text style={s.userText}>{msg.text}</Text>
        </View>
        <View style={s.userAvatar}>
          <Text style={s.userAvatarText}>{userInitials}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.assistantRow}>
      <View style={s.assistantAvatar}>
        <Iconify icon="solar:map-point-wave-bold" size={wScale(16)} color="#FFFFFF" />
      </View>
      <View style={s.assistantContent}>
        <View style={s.assistantBubble}>
          <Text style={s.assistantText}>{msg.text}</Text>
        </View>
        {msg.routeCard && (
          <RouteCardView
            card={msg.routeCard}
            colors={colors}
            onSave={() => onSaveRoute?.(msg.routeCard!)}
            saving={savingCardId === msg.id}
          />
        )}
      </View>
    </View>
  );
};

const makeBubbleStyles = (colors: AppColors) =>
  StyleSheet.create({
    userRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      gap: wScale(8),
      marginBottom: hScale(16),
    },
    userBubble: {
      maxWidth: '72%',
      backgroundColor: colors.primary,
      borderRadius: wScale(18),
      borderBottomRightRadius: wScale(5),
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(11),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 3,
    },
    userText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: '#FFFFFF',
      lineHeight: hScale(20),
    },
    userAvatar: {
      width: wScale(30),
      height: wScale(30),
      borderRadius: wScale(15),
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userAvatarText: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
    assistantRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: wScale(10),
      marginBottom: hScale(16),
    },
    assistantAvatar: {
      width: wScale(32),
      height: wScale(32),
      borderRadius: wScale(16),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hScale(2),
      flexShrink: 0,
    },
    assistantContent: { flex: 1 },
    assistantBubble: {
      backgroundColor: colors.white,
      borderRadius: wScale(18),
      borderBottomLeftRadius: wScale(5),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(11),
    },
    assistantText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textPrimary,
      lineHeight: hScale(20),
    },
  });

// ─── Suggestions ──────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Nearby restaurants',
  'Hidden gems',
  'Best viewpoints',
  'Night activities',
];

let _msgCounter = 0;
const nextMsgId = (prefix: string) => `${prefix}${++_msgCounter}`;

// ─── Main Screen ──────────────────────────────────────────────────────────────

const BelenScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const user = useSelector((s: RootState) => s.User.user);
  const locationName = useSelector((s: RootState) => s.User.locationName);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [savingCardId, setSavingCardId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const userInitials = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'A';

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsgId = nextMsgId('u');
    const typingId = 'typing';

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: trimmed },
      { id: typingId, role: 'typing' },
    ]);
    setInputText('');
    setSending(true);

    try {
      const context: Record<string, any> = {};
      if (locationName) context.city = locationName;
      if (user?.travel_style) context.travel_style = user.travel_style;
      if (user?.budget_level) context.budget_level = user.budget_level;
      if (user?.interests?.length) context.interests = user.interests;

      const res = await assistantService.sendMessage({
        message: trimmed,
        conversation_id: conversationIdRef.current ?? undefined,
        context: Object.keys(context).length ? context : undefined,
      });

      const { conversation_id, message } = res.data.data;
      conversationIdRef.current = conversation_id;

      const assistantMsgId = nextMsgId('a');
      setMessages(prev =>
        prev
          .filter(m => m.id !== typingId)
          .concat({
            id: assistantMsgId,
            role: 'assistant',
            text: message.text,
            routeCard: message.route_card ?? undefined,
          }),
      );
    } catch (err: any) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      const code = err?.response?.data?.error?.code;
      let errorText = t('assistant.genericError', 'Something went wrong. Please try again.');
      if (code === 'RATE_LIMIT') {
        errorText = t('assistant.rateLimitError', "You've reached your daily AI message limit. Upgrade to Premium for unlimited access.");
      } else if (code === 'AI_SERVICE_ERROR') {
        errorText = t('assistant.serviceError', 'AI service is temporarily unavailable. Please try again later.');
      }
      setMessages(prev => [
        ...prev,
        { id: nextMsgId('err'), role: 'assistant', text: errorText },
      ]);
    } finally {
      setSending(false);
    }
  }, [sending, user, locationName, t]);

  const saveRoute = useCallback(async (card: ApiRouteCard, msgId: string) => {
    if (savingCardId) return;
    setSavingCardId(msgId);
    try {
      await routesService.create({
        name: card.title,
        is_ai_generated: true,
        stops: card.stops.map(s => ({ name: s.name, description: s.description })),
      });
      Alert.alert(
        t('assistant.routeSaved', 'Route Saved'),
        t('assistant.routeSavedMsg', 'The route has been added to My Routes.'),
        [{ text: t('common.ok', 'OK') }],
      );
    } catch {
      Alert.alert(
        t('common.error', 'Error'),
        t('assistant.routeSaveError', 'Could not save route. Please try again.'),
      );
    } finally {
      setSavingCardId(null);
    }
  }, [savingCardId, t]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? hScale(90) : 0}
    >
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('assistant.title')}</Text>
        <TouchableOpacity
          style={styles.headerIconBtn}
          hitSlop={8}
          onPress={() => (navigation as any).navigate('ChatSettings')}
        >
          <Iconify icon="solar:settings-linear" size={wScale(20)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={styles.msgList}
        contentContainerStyle={styles.msgContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Iconify icon="solar:map-point-wave-bold" size={wScale(36)} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{t('assistant.emptyTitle', 'Hi! I\'m Belen')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('assistant.emptySubtitle', 'Ask me to plan a route, find places, or discover hidden gems in your city.')}
            </Text>
          </View>
        )}

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            colors={colors}
            userInitials={userInitials}
            onSaveRoute={(card) => {
              const msgId = msg.id;
              saveRoute(card, msgId);
            }}
            savingCardId={savingCardId ?? undefined}
          />
        ))}
      </ScrollView>

      {/* ── Suggestion Chips ───────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {SUGGESTIONS.map(s => (
          <TouchableOpacity
            key={s}
            style={styles.chip}
            onPress={() => sendMessage(s)}
            activeOpacity={0.75}
            disabled={sending}
          >
            <Text style={styles.chipText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Input Bar ──────────────────────────────────────────────────────── */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={t('assistant.placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
          multiline
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
          onPress={() => sendMessage(inputText)}
          activeOpacity={0.85}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Iconify icon="solar:arrow-up-bold" size={wScale(18)} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BelenScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    headerIconBtn: {
      width: wScale(36),
      height: wScale(36),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: wScale(17),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },

    msgList: { flex: 1 },
    msgContent: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(20),
      paddingBottom: hScale(8),
      flexGrow: 1,
    },

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wScale(24),
      paddingVertical: hScale(60),
      gap: hScale(12),
    },
    emptyIcon: {
      width: wScale(72),
      height: wScale(72),
      borderRadius: wScale(22),
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: hScale(4),
    },
    emptyTitle: {
      fontSize: wScale(20),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: hScale(20),
    },

    chipsScroll: {
      flexGrow: 0,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
      backgroundColor: colors.inputBackground,
    },
    chipsContent: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(10),
      gap: wScale(8),
    },
    chip: {
      backgroundColor: colors.white,
      borderRadius: wScale(20),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(7),
    },
    chipText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textPrimary,
    },

    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: wScale(10),
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(10),
      paddingBottom: Platform.OS === 'ios' ? hScale(24) : hScale(14),
      backgroundColor: colors.inputBackground,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
    },
    input: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: wScale(22),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(16),
      paddingTop: hScale(11),
      paddingBottom: hScale(11),
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textPrimary,
      maxHeight: hScale(100),
    },
    sendBtn: {
      width: wScale(42),
      height: wScale(42),
      borderRadius: wScale(21),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 4,
    },
    sendBtnDisabled: {
      backgroundColor: colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
  });

import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteStop {
  name: string;
  description: string;
}

interface RouteCard {
  title: string;
  distance: string;
  duration: string;
  imageUrl: string;
  stops: RouteStop[];
}

type Message =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; card?: RouteCard };

// ─── Initial conversation ─────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'user',
    text: 'Plan a walk in Sultanahmet for this afternoon. I have about 4 hours.',
  },
  {
    id: 'm2',
    role: 'assistant',
    text: "Certainly! I've curated a premium walking route through the historic heart of Istanbul for you.",
    card: {
      title: 'Historical Sultanahmet Walk',
      distance: '2.4 km',
      duration: '3.5 Hours',
      imageUrl:
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80&fit=crop',
      stops: [
        {
          name: 'Hagia Sophia',
          description: 'Iconic Byzantine monument & museum',
        },
        {
          name: 'Blue Mosque',
          description: 'Majestic 17th-century landmark',
        },
        {
          name: 'Basilica Cistern',
          description: 'Subterranean Roman water reservoir',
        },
      ],
    },
  },
];

// Mock replies for demo purposes
const MOCK_REPLIES: { text: string; card?: RouteCard }[] = [
  {
    text: "Great choice! Here's another popular route you might enjoy in the Grand Bazaar area.",
    card: {
      title: 'Grand Bazaar & Spice Market',
      distance: '1.8 km',
      duration: '2.5 Hours',
      imageUrl:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe0fa?w=600&q=80&fit=crop',
      stops: [
        { name: 'Grand Bazaar', description: 'One of the oldest covered markets in the world' },
        { name: 'Nuruosmaniye Mosque', description: 'Ottoman Baroque masterpiece' },
        { name: 'Spice Bazaar', description: 'Vibrant Egyptian market full of aromas' },
      ],
    },
  },
  {
    text: "I'd recommend the Bosphorus waterfront for a relaxing afternoon walk. Here's what I suggest.",
    card: {
      title: 'Bosphorus Waterfront Stroll',
      distance: '3.2 km',
      duration: '2 Hours',
      imageUrl:
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80&fit=crop',
      stops: [
        { name: 'Dolmabahçe Palace', description: 'Lavish 19th-century Ottoman palace' },
        { name: 'Beşiktaş Pier', description: 'Lively ferry terminal & square' },
        { name: 'Ortaköy Mosque', description: 'Iconic Bosphorus waterside mosque' },
      ],
    },
  },
  {
    text: 'Sure! Here is a concise route tailored to your preferences.',
  },
];

// ─── Route Card Component ─────────────────────────────────────────────────────

const RouteCardView: React.FC<{ card: RouteCard; colors: AppColors }> = ({ card, colors }) => {
  const s = useMemo(() => makeCardStyles(colors), [colors]);
  return (
    <View style={s.card}>
      {/* Image */}
      <View style={s.imageWrap}>
        <Image source={{ uri: card.imageUrl }} style={s.image} resizeMode="cover" />
        <View style={s.distanceBadge}>
          <Iconify icon="solar:map-point-bold" size={wScale(11)} color="#FFFFFF" />
          <Text style={s.distanceText}>{card.distance}</Text>
        </View>
      </View>

      {/* Title row */}
      <View style={s.titleRow}>
        <Text style={s.title} numberOfLines={2}>{card.title}</Text>
        <View style={s.titleActions}>
          <TouchableOpacity hitSlop={8}>
            <Iconify icon="solar:share-linear" size={wScale(17)} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8}>
            <Iconify icon="solar:cloud-download-linear" size={wScale(17)} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Duration */}
      <View style={s.durationRow}>
        <Iconify icon="solar:clock-circle-linear" size={wScale(13)} color={colors.textSecondary} />
        <Text style={s.durationText}>{card.duration}</Text>
        <View style={s.metaDot} />
        <Iconify icon="solar:map-point-linear" size={wScale(13)} color={colors.textSecondary} />
        <Text style={s.durationText}>{card.stops.length} stops</Text>
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Stops */}
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

      {/* Button */}
      <TouchableOpacity style={s.navBtn} activeOpacity={0.85}>
        <Iconify icon="solar:map-arrow-right-bold" size={wScale(16)} color="#FFFFFF" />
        <Text style={s.navBtnText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeCardStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderRadius: wScale(16),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.stroke,
      marginTop: hScale(10),
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    imageWrap: {
      position: 'relative',
      width: '100%',
      height: hScale(140),
    },
    image: {
      width: '100%',
      height: '100%',
    },
    distanceBadge: {
      position: 'absolute',
      bottom: hScale(10),
      left: wScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      backgroundColor: 'rgba(0,0,0,0.55)',
      paddingHorizontal: wScale(9),
      paddingVertical: hScale(4),
      borderRadius: wScale(10),
    },
    distanceText: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: wScale(8),
      paddingHorizontal: wScale(14),
      paddingTop: hScale(12),
      paddingBottom: hScale(6),
    },
    title: {
      flex: 1,
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
      lineHeight: hScale(21),
    },
    titleActions: {
      flexDirection: 'row',
      gap: wScale(10),
      paddingTop: hScale(2),
    },
    durationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
      paddingHorizontal: wScale(14),
      paddingBottom: hScale(12),
    },
    durationText: {
      fontSize: wScale(12),
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
      marginBottom: hScale(12),
    },
    stopRow: {
      flexDirection: 'row',
      paddingHorizontal: wScale(14),
      marginBottom: hScale(4),
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
      paddingBottom: hScale(14),
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
    navBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(8),
      backgroundColor: colors.primary,
      margin: wScale(14),
      marginTop: hScale(4),
      borderRadius: wScale(14),
      paddingVertical: hScale(13),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    navBtnText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
  });

// ─── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble: React.FC<{ msg: Message; colors: AppColors; userInitials: string }> = ({
  msg,
  colors,
  userInitials,
}) => {
  const s = useMemo(() => makeBubbleStyles(colors), [colors]);

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
        {msg.card && <RouteCardView card={msg.card} colors={colors} />}
      </View>
    </View>
  );
};

const makeBubbleStyles = (colors: AppColors) =>
  StyleSheet.create({
    // User
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

    // Assistant
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
    assistantContent: {
      flex: 1,
    },
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

// ─── Quick Suggestion Chips ───────────────────────────────────────────────────

const SUGGESTIONS = [
  'Nearby restaurants',
  'Hidden gems',
  'Best viewpoints',
  'Night activities',
];

// Monotonic counter to guarantee unique IDs without relying on Date.now() resolution
let _msgCounter = INITIAL_MESSAGES.length;
const nextMsgId = (prefix: string) => `${prefix}${++_msgCounter}`;

// ─── Main Screen ──────────────────────────────────────────────────────────────

const BelenScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const user = useSelector((s: RootState) => s.User.user);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [replyIndex, setReplyIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const userInitials = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'A';

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: nextMsgId('u'),
      role: 'user',
      text: trimmed,
    };

    const reply = MOCK_REPLIES[replyIndex % MOCK_REPLIES.length];
    const assistantMsg: Message = {
      id: nextMsgId('a'),
      role: 'assistant',
      text: reply.text,
      card: reply.card,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setReplyIndex(i => i + 1);
    setInputText('');
  };

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
        <TouchableOpacity style={styles.headerIconBtn} hitSlop={8} onPress={() => (navigation as any).navigate('ChatSettings')}>
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
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            colors={colors}
            userInitials={userInitials}
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
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(inputText)}
          activeOpacity={0.85}
          disabled={!inputText.trim()}
        >
          <Iconify icon="solar:arrow-up-bold" size={wScale(18)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BelenScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
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

    // Messages
    msgList: {
      flex: 1,
    },
    msgContent: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(20),
      paddingBottom: hScale(8),
    },

    // Chips
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

    // Input
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

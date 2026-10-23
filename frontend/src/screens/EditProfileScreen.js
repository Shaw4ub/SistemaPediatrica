import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import Avatar from '../components/Avatar';
import { FormField } from '../components/FormField';
import { radius, spacing } from '../theme';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [nombreUsuario, setNombreUsuario] = useState(user?.nombreUsuario || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');

  const handleSubmit = () => {
    if (!nombreUsuario.trim()) {
      Alert.alert('Falta el nombre', 'El nombre de usuario es obligatorio.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Correo inválido', 'Escribe un correo electrónico válido.');
      return;
    }

    updateUser({
      nombreUsuario: nombreUsuario.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
    });

    Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarCard}>
          <Avatar name={nombreUsuario || user?.nombreUsuario} size={74} />
          <Text style={styles.avatarName}>
            {nombreUsuario || 'Usuario'}
          </Text>
          <Text style={styles.avatarRole}>{user?.rol || 'Usuario'}</Text>
          <View style={styles.roleNotice}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={colors.primaryDeep}
            />
            <Text style={styles.roleNoticeText}>
              El rol se administra desde el sistema
            </Text>
          </View>
        </View>

        <AppCard style={styles.card}>
          <FormField
            label="Nombre de usuario"
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
          <FormField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@clinica.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormField
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+503 0000 0000"
            keyboardType="phone-pad"
          />
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            title="Guardar cambios"
            icon="save-outline"
            onPress={handleSubmit}
            fullWidth
          />
          <AppButton
            title="Cancelar"
            variant="ghost"
            onPress={() => navigation.goBack()}
            fullWidth
            style={styles.cancel}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxxl,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },
    avatarCard: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      marginBottom: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarName: {
      marginTop: spacing.md,
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    avatarRole: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '600',
      color: colors.primaryDark,
    },
    roleNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: spacing.md,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    roleNoticeText: {
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.primaryDeep,
    },
    card: {
      paddingBottom: spacing.xs,
    },
    actions: {
      marginTop: spacing.lg,
    },
    cancel: {
      marginTop: spacing.xs,
    },
  });

export default EditProfileScreen;

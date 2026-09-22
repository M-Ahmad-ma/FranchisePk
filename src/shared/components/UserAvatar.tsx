import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Avatar from './Avatar';
import { useAuth } from '../auth/AuthContext';
import { imageUrl } from '../api/imageUrl';

type InitialsStyle = 'first' | 'full';

interface UserAvatarProps {
  size?: number;
  /**
   * Custom press handler.
   * - omit → built-in: no token → Auth/Login; token → BrandDrawer
   * - function → use this instead
   * - null → not pressable
   */
  onPress?: (() => void) | null;
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  /** Override image URI (local pick, profile API, etc.) */
  imageUri?: string | null;
  /** Override initials (skips derivation from name) */
  initials?: string;
  /** Name used to derive initials when `initials` is not provided */
  name?: string;
  /**
   * 'first' → first letter of the name (headers)
   * 'full'  → first letters of each name part, up to 2 (profiles)
   * Default: 'first'
   */
  initialsStyle?: InitialsStyle;
  /** Show a User icon when signed out (default true — typical for headers) */
  showSignedOutIcon?: boolean;
}

function getInitials(name: string | undefined | null, style: InitialsStyle): string {
  const trimmed = name?.trim();
  if (!trimmed) return '?';

  if (style === 'full') {
    return trimmed
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return trimmed.charAt(0).toUpperCase();
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 44,
  onPress,
  className = '',
  textClassName = '',
  imageClassName = '',
  imageUri,
  initials,
  name,
  initialsStyle = 'first',
  showSignedOutIcon = true,
}) => {
  const { token, user } = useAuth();
  const navigation = useNavigation();

  const resolvedName = name ?? user?.name;
  const resolvedImageUri =
    imageUri ?? (token && user?.image ? imageUrl(user.image) : undefined);
  const resolvedInitials = initials ?? getInitials(resolvedName, initialsStyle);
  const signedIn = !!token || !!imageUri;

  const handleDefaultPress = () => {
    if (!token) {
      // Navigate to Auth > Login (role brand); action bubbles to root stack
      (navigation as any).navigate('Auth', {
        screen: 'Login',
        params: { role: 'brand' },
      });
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'BrandDrawer' }],
      }),
    );
  };

  if (onPress === null) {
    return (
      <Avatar
        size={size}
        source={resolvedImageUri ? { uri: resolvedImageUri } : undefined}
        initials={resolvedInitials}
        className={className}
        textClassName={textClassName}
        imageClassName={imageClassName}
      />
    );
  }

  const handlePress = onPress ?? handleDefaultPress;
  const content = !signedIn && showSignedOutIcon ? (
    <View
      className="bg-primary-700 items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      <User color="white" size={Math.round(size * 0.4)} />
    </View>
  ) : (
    <Avatar
      size={size}
      source={resolvedImageUri ? { uri: resolvedImageUri } : undefined}
      initials={resolvedInitials}
      className={className}
      textClassName={textClassName}
      imageClassName={imageClassName}
    />
  );

  // Custom onPress on signed-in Avatar: let Avatar handle press
  if (onPress !== undefined && signedIn) {
    return (
      <Avatar
        size={size}
        source={resolvedImageUri ? { uri: resolvedImageUri } : undefined}
        initials={resolvedInitials}
        className={className}
        textClassName={textClassName}
        imageClassName={imageClassName}
        onPress={handlePress}
      />
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      accessibilityRole="button"
    >
      {content}
    </TouchableOpacity>
  );
};

export default UserAvatar;

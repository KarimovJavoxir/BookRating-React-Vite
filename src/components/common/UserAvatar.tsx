import { useState } from 'react'
import { resolveMediaUrl } from '../../utils/mediaUrl'

interface UserAvatarProps {
  username?: string | null
  profilePictureUrl?: string | null
  size?: 'default' | 'small'
}

export function UserAvatar({ username, profilePictureUrl, size = 'default' }: UserAvatarProps) {
  const [hasLoadError, setHasLoadError] = useState(false)
  const resolvedProfilePictureUrl = hasLoadError ? undefined : resolveMediaUrl(profilePictureUrl)
  const className = size === 'small' ? 'avatar avatar--small' : 'avatar'

  if (resolvedProfilePictureUrl) {
    return (
      <img
        className={className}
        src={resolvedProfilePictureUrl}
        alt={`${username?.trim() || 'Foydalanuvchi'} profili`}
        onError={() => setHasLoadError(true)}
      />
    )
  }

  return (
    <span className={className} aria-label="Foydalanuvchi rasmi mavjud emas">
      U
    </span>
  )
}

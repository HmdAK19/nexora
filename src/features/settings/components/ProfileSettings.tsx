import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Avatar, Box, Button, TextField, Typography } from '@mui/material';

import type { User } from '@shared/model';

import type { SettingsController } from '../hooks';
import { styles } from '../Settings.styles';

interface ProfileSettingsProps {
  controller: SettingsController;
  user?: User | null;
}

export function ProfileSettings({ controller, user }: ProfileSettingsProps) {
  const { t } = useTranslation();
  const {
    accountSettings,
    profileForm: {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    saveProfile,
    selectPhoto,
    avatarValidationError,
  } = controller;

  return (
    <Box component="form" onSubmit={(event) => void handleSubmit(saveProfile)(event)}>
      <Box sx={styles.box5}>
        <Avatar src={accountSettings.profile?.avatarUrl ?? undefined} sx={styles.avatar6}>
          {(accountSettings.profile?.name ?? user?.name)?.slice(0, 1)}
        </Avatar>
        <Box>
          <Typography variant="h3">{accountSettings.profile?.name ?? user?.name}</Typography>
          <Typography color="text.secondary" variant="body2">
            {t('settings.verificationLevel', { level: user?.level })}
          </Typography>
          <Button component="label" disabled={accountSettings.avatarPending} size="small" sx={styles.button7}>
            {t('settings.changePhoto')}
            <input
              hidden
              accept="image/png,image/jpeg,image/webp"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void selectPhoto(file);
              }}
            />
          </Button>
          {avatarValidationError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {t(`settings.avatarError.${avatarValidationError}`)}
            </Alert>
          )}
        </Box>
      </Box>
      <Box sx={styles.box8}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              label={t('settings.fullName')}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              label={t('settings.email')}
              slotProps={{ input: { readOnly: true } }}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              label={t('settings.phone')}
            />
          )}
        />
      </Box>
      <Button disabled={isSubmitting} sx={styles.button9} type="submit" variant="contained">
        {t('common.save')}
      </Button>
    </Box>
  );
}

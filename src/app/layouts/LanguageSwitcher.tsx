import { Languages } from 'lucide-react';
import { Box, Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';
import type { Language } from '@shared/model';

import { languageSwitcherStyles as styles } from './LanguageSwitcher.styles';

interface LanguageSwitcherProps {
  language: Language;
  onToggle: () => void | Promise<void>;
}

export function LanguageSwitcher({ language, onToggle }: LanguageSwitcherProps) {
  const { t } = useTranslation(NAMESPACES.layout);
  const accessibleLabel = `${t('languageSwitch')} · ${t('languageDescription')}`;

  return (
    <Tooltip title={accessibleLabel}>
      <Button
        aria-label={accessibleLabel}
        onClick={() => void onToggle()}
        startIcon={<Languages aria-hidden="true" size={18} />}
        sx={styles.button}
        type="button"
        variant="text"
      >
        <Box component="span" sx={styles.label}>
          {t('languageSwitch')}
        </Box>
        <Box component="span" lang="en" sx={styles.badge}>
          {language.toUpperCase()}
        </Box>
      </Button>
    </Tooltip>
  );
}

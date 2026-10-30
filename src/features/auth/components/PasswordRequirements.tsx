import { Check, Circle } from 'lucide-react';
import { Box, Typography } from '@mui/material';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  requirements: readonly PasswordRequirement[];
  title: string;
}

export function PasswordRequirements({ requirements, title }: PasswordRequirementsProps) {
  return (
    <Box
      aria-label={title}
      component="section"
      sx={{
        bgcolor: 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: 1.25,
        py: 1,
      }}
    >
      <Typography color="text.secondary" display="block" fontSize={10.5} fontWeight={750} lineHeight={1.3}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 0.35,
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          mt: 0.65,
        }}
      >
        {requirements.map((requirement) => (
          <Box
            alignItems="center"
            color={requirement.met ? 'success.main' : 'text.secondary'}
            display="flex"
            gap={0.5}
            key={requirement.label}
          >
            {requirement.met ? (
              <Check aria-hidden="true" size={12} />
            ) : (
              <Circle aria-hidden="true" size={6} />
            )}
            <Typography fontSize={10} lineHeight={1.25}>
              {requirement.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

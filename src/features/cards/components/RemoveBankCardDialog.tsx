import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface RemoveBankCardDialogProps {
  open: boolean;
  pending: boolean;
  labels: { cancel: string; confirm: string; description: string; title: string };
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveBankCardDialog(props: RemoveBankCardDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{props.labels.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.labels.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={props.pending} onClick={props.onClose}>
          {props.labels.cancel}
        </Button>
        <Button color="error" variant="contained" disabled={props.pending} onClick={props.onConfirm}>
          {props.labels.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

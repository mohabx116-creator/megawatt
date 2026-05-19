import Chip, { ChipProps } from '@mui/material/Chip';

import { formatLabel } from '../utils/formatters';

type ErpStatusChipProps = {
  status: string;
  color?: ChipProps['color'];
};

const getStatusColor = (status: string): ChipProps['color'] => {
  if (['active', 'paid', 'issued', 'in_stock'].includes(status)) return 'success';
  if (['low_stock', 'partially_paid', 'pending'].includes(status)) return 'warning';
  if (['out_of_stock', 'overdue', 'unpaid', 'credit_hold'].includes(status)) return 'error';
  if (['discontinued', 'cancelled', 'inactive'].includes(status)) return 'default';
  return 'info';
};

export const ErpStatusChip = ({ status, color }: ErpStatusChipProps) => (
  <Chip size="small" label={formatLabel(status)} color={color ?? getStatusColor(status)} variant="outlined" sx={{ borderRadius: 1, fontWeight: 700 }} />
);

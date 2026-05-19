import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function SkeletonEarningCard() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={118} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </Stack>
  );
}

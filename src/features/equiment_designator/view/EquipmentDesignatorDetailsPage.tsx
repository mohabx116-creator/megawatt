import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Box
} from '@mui/material';

// MUI X
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useEquipmentDesignatorVm } from '../vm/equipmentDesignator.vm';
import EarningCard from '../components/EarningCard';

export default function EquipmentDesignatorDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);

  const status = useEquipmentDesignatorVm((s) => s.status);
  const error = useEquipmentDesignatorVm((s) => s.error);
  const details = useEquipmentDesignatorVm((s) => s.details);

  const loadById = useEquipmentDesignatorVm((s) => s.loadById);
  const clear = useEquipmentDesignatorVm((s) => s.clear);

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) return;
    void loadById(numericId);
    return () => clear();
  }, [numericId, loadById, clear]);

  const invalidId = !Number.isFinite(numericId) || numericId <= 0;

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'eqd', headerName: 'EQD', width: 140 },
      { field: 'narrative', headerName: 'Narrative', flex: 1, minWidth: 200 },

      { field: 'modelFk', headerName: 'Model FK', width: 140 },
      { field: 'externalPowerSourceFk', headerName: 'External Power Source FK', width: 220 },
      { field: 'mobilityFk', headerName: 'Mobility FK', width: 140 },

      { field: 'pmeClassCategoryFk', headerName: 'PME Class Category FK', width: 220 },
      { field: 'eqdTypeFk', headerName: 'EQD Type FK', width: 140 },

      { field: 'oilHighRate', headerName: 'Oil High Rate', width: 140 },
      { field: 'oilLowRate', headerName: 'Oil Low Rate', width: 140 },

      { field: 'rowVersion', headerName: 'Row Version', width: 120 },

      {
        field: 'configuredItemInd',
        headerName: 'Configured Item',
        width: 160,
        valueFormatter: (value) => (value === true ? 'Yes' : value === false ? 'No' : '—')
      },
      {
        field: 'historyInd',
        headerName: 'History',
        width: 120,
        valueFormatter: (value) => (value === true ? 'Yes' : value === false ? 'No' : '—')
      },
      {
        field: 'weaponSystemInd',
        headerName: 'Weapon System',
        width: 160,
        valueFormatter: (value) => (value === true ? 'Yes' : value === false ? 'No' : '—')
      }
    ],
    []
  );

  // one record => one row (pagination still works; useful when you later show multiple rows)
  const rows = useMemo(() => {
    if (!details) return [];
    return [
      {
        id: details.id,
        eqd: details.eqd,
        narrative: details.narrative ?? '—',

        modelFk: details.modelFk ?? '—',
        externalPowerSourceFk: details.externalPowerSourceFk ?? '—',
        mobilityFk: details.mobilityFk ?? '—',

        pmeClassCategoryFk: details.pmeClassCategoryFk ?? '—',
        eqdTypeFk: details.eqdTypeFk ?? '—',

        oilHighRate: details.oilHighRate ?? '—',
        oilLowRate: details.oilLowRate ?? '—',

        rowVersion: details.rowVersion ?? '—',

        configuredItemInd: details.configuredItemInd,
        historyInd: details.historyInd,
        weaponSystemInd: details.weaponSystemInd
      }
    ];
  }, [details]);

  return (
    <MainCard title="Equipment Designator Details">
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={2}>
            {invalidId && <Alert severity="error">Invalid id in route.</Alert>}

            {!invalidId && status === 'loading' && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CircularProgress size={20} />
                <Typography variant="body2">Loading...</Typography>
              </Stack>
            )}

            {!invalidId && status === 'error' && (
              <Alert severity="error">{error ?? 'Failed to load data.'}</Alert>
            )}

            {!invalidId && status === 'success' && details && (
              <>
                <Stack spacing={0.5}>
                  <Typography variant="h4">
                    {details.eqd}{' '}
                    <Typography component="span" variant="body2" color="text.secondary">
                      (# {details.id})
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {details.narrative || '—'}
                  </Typography>
                </Stack>

                <Divider />

                <Box sx={{ width: '100%' }}>
                  <DataGrid

                  
                    rows={rows}
                    columns={columns}
                    autoHeight
                    disableRowSelectionOnClick
                    density="compact"
                    pagination
                    initialState={{
                      pagination: { paginationModel: { page: 0, pageSize: 10 } },
                       filter: {
      filterModel: {
        items: [],
        quickFilterValues: ['Disney', 'Star'],
      },
    },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    sx={{
                      '& .MuiDataGrid-menuIcon': { visibility: 'visible' }
                    }}
                  />
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
        
      </Card>

      <EarningCard isLoading={true}></EarningCard>
    </MainCard>
  );
}

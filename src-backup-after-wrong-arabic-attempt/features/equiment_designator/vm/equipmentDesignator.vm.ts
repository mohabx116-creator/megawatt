import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EquipmentDesignatorDetails } from '../model/equipmentDesignator.types';
import { equipmentDesignatorApi } from '../api/equipmentDesignator.api';

type Status = 'idle' | 'loading' | 'success' | 'error';

type EquipmentDesignatorState = {
  status: Status;
  error?: string;

  details?: EquipmentDesignatorDetails;

  loadById: (id: number) => Promise<void>;
  clear: () => void;
};

export const useEquipmentDesignatorVm = create<EquipmentDesignatorState>()(
  devtools(
    (set) => ({
      status: 'idle',
      details: undefined,
      error: undefined,

      clear: () => set({ status: 'idle', details: undefined, error: undefined }),

      loadById: async (id) => {
        set({ status: 'loading', error: undefined });
        try {
          const details = await equipmentDesignatorApi.getById(id);
          set({ status: 'success', details });
        } catch (e: any) {
          set({
            status: 'error',
            error: e?.response?.data?.message ?? e?.message ?? 'Failed to load equipment designator'
          });
        }
      }
    }),
    { name: 'equipment-designator.vm' }
  )
);

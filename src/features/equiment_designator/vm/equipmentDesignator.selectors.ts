import { useEquipmentDesignatorVm } from './equipmentDesignator.vm';

export const useEquipmentDesignatorStatus = () => useEquipmentDesignatorVm((s) => s.status);
export const useEquipmentDesignatorError = () => useEquipmentDesignatorVm((s) => s.error);
export const useEquipmentDesignatorDetails = () => useEquipmentDesignatorVm((s) => s.details);
export const useEquipmentDesignatorActions = () =>
  useEquipmentDesignatorVm((s) => ({ loadById: s.loadById, clear: s.clear }));

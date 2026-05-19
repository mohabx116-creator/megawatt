export type EquipmentDesignatorDetails = {
    id: number;
    eqd: string;
    narrative: string;
    modelFk: number | null;
    externalPowerSourceFk: number | null;
    mobilityFk: number | null;
    configuredItemInd: boolean;
    pmeClassCategoryFk: number | null;
    historyInd: boolean;
    weaponSystemInd: boolean;
    eqdTypeFk: number | null;
    oilHighRate: number | null;
    oilLowRate: number | null;
    rowVersion: number;
  };
  
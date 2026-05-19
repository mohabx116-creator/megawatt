import axios from 'utils/axios';
import type { EquipmentDesignatorDetails } from '../model/equipmentDesignator.types';

export const equipmentDesignatorApi = {
  async getById(id: number): Promise<EquipmentDesignatorDetails> {
    const res = await axios.get(`api/management-control/equipment-designators/${id}`, {
      headers: { accept: 'application/json' }
    });
    return res.data;
  }
};

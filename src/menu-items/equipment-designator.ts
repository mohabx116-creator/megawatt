import { IconKey } from '@tabler/icons-react';

const equipmentDesignator = {
  id: 'equipment-designator-group',
  title: 'Equipment Designator',
  type: 'group',
  children: [
    {
      id: 'equipment-designator',
      title: 'Equipment Designator',
      type: 'item',
      url: '/management-control/equipment-designators/1',
      icon: IconKey,
      breadcrumbs: true
    }
  ]
};

export default equipmentDesignator;

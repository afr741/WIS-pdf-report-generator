const countryCode = ['TJK-DUSHANBE', 'TJK-BOKHTAR', 'TJK-KHUJAND'];

const uploadIcon = '../../assets/images/upload-icon.svg';
const editIcon = '../../assets/images/edit-icon.svg';
const reportsIcon = '../../assets/images/reports-icon.svg';

const routeData: Array<any> = [
  {
    routeId: 'landing',
    label: 'Landing',
    icon: 'landing',
    shouldRenderTile: false,
  },
  {
    routeId: 'reset',
    label: 'Reset',
    icon: 'reset',
    shouldRenderTile: false,
  },
  {
    routeId: 'upload',
    label: 'Upload docs',
    icon: uploadIcon,
    shouldRenderTile: true,
  },
  {
    routeId: 'pdf',
    label: 'Past Reports',
    icon: reportsIcon,
    shouldRenderTile: true,
  },
  {
    routeId: 'edit',
    label: 'Edit Template',
    icon: editIcon,
    shouldRenderTile: true,
  },
];

export { countryCode, routeData };

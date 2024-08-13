// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  FileTextOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  UserAddOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  UserAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Dcoument Management',
  type: 'group',
  children: [
    {
      id: 'document-upload',
      title: 'Upload Document',
      type: 'item',
      url: '/document-upload',
      icon: icons.FileAddOutlined
    }
    ,
    {
      id: 'document-review',
      title: 'Document Review',
      type: 'item',
      url: '/document-review',
      icon: icons.FileTextOutlined
    },
    {
      id: 'audit-finance-interface',
      title: 'Audit Finance Interface',
      type: 'item',
      url: '/audit-finance-interface',
      icon: icons.FileSearchOutlined
    },
    {
      id: 'add-user',
      title: 'Add New User',
      type: 'item',
      url: '/add-user',
      icon: icons.UserAddOutlined
    }
  ]
};

export default utilities;

import useAuthStore from '../store/useAuthStore';
import MenuDrawer from './MenuDrawer';
import PublicStack from './PublicStack';

const RootNavigator = () => {
  const { user } = useAuthStore();
  if (!user) {
    return <PublicStack />;
  }

  return <MenuDrawer />;
};

export default RootNavigator;

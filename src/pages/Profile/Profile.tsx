import React from 'react';
import ProfileDesktop from './ProfileDesktop';
import { ProfileMobile } from './ProfileMobile';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWalkthroughStore } from '@/store/walkthroughStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Profile: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { settingsHighlight, setSettingsHighlight } = useWalkthroughStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (settingsHighlight === 'profile') {
      const timer = setTimeout(() => {
        setSettingsHighlight('notifications');
        navigate('/settings');
      }, 3000);
      return () => clearTimeout(timer);
    }
  
  }, [settingsHighlight, setSettingsHighlight, navigate]);

  // Force tab selection when highlighting
  const forceSecurityTab = settingsHighlight === 'security';
  const forceWorkTab = settingsHighlight === 'work';
  return (
    <div 
      className={
        settingsHighlight === 'profile'
          ? 'profile-highlight'
          : settingsHighlight === 'security'
          ? 'security-highlight'
          : settingsHighlight === 'work'
          ? 'work-highlight'
          : ''
      }
    >
      {isMobile ? <ProfileMobile forceSecurityTab={forceSecurityTab} forceWorkTab={forceWorkTab} /> : <ProfileDesktop forceSecurityTab={forceSecurityTab} forceWorkTab={forceWorkTab} />}
    </div>
  );
};

export default Profile;
import { useState } from 'react';
import { useConfig } from './hooks/useConfig.js';
import Onboarding from './components/Onboarding/Onboarding.jsx';
import BottomNav from './components/shared/BottomNav.jsx';
import Today from './components/tabs/Today.jsx';
import Timeline from './components/tabs/Timeline.jsx';
import Tools from './components/tabs/Tools.jsx';
import Progress from './components/tabs/Progress.jsx';
import Journal from './components/tabs/Journal.jsx';

export default function App() {
  const { config, saveConfig } = useConfig();
  const [tab, setTab] = useState('today');

  if (!config?.onboardingComplete) {
    return <Onboarding onComplete={saveConfig} />;
  }

  return (
    <div className="app">
      <div className="screen">
        {tab === 'today'    && <Today    config={config} />}
        {tab === 'timeline' && <Timeline config={config} />}
        {tab === 'tools'    && <Tools    config={config} />}
        {tab === 'progress' && <Progress config={config} />}
        {tab === 'journal'  && <Journal  config={config} />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

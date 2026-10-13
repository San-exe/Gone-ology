
import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OLAPWarehouse from './pages/OLAPWarehouse';
import ClusteringStudio from './pages/ClusteringStudio';
import ChurnPredictor from './pages/ChurnPredictor';
import PipelineDiagnostics from './pages/PipelineDiagnostics';
import { checkHealth } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('olap');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLanding, setShowLanding] = useState(true);

  // Periodic backend health check
  useEffect(() => {
    if (showLanding) return;

    let isMounted = true;

    const verifyBackend = async () => {
      try {
        const res = await checkHealth();

        if (isMounted) {
          setIsConnected(res?.status === 'healthy');
        }
      } catch (err) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    verifyBackend();

    const interval = setInterval(verifyBackend, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [showLanding]);

  const handleRetrained = () => {
    // Trigger data refreshes across dashboard views
    setRefreshKey((prev) => prev + 1);
  };

  // Show landing page before the existing dashboard
  // All hooks are declared above this conditional return.
  if (showLanding) {
    return (
      <Landing
        onLaunch={() => setShowLanding(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Left navigation sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main application area */}
      <div className="flex-1 min-h-screen flex flex-col bg-black overflow-y-auto">
        <Header
          isConnected={isConnected}
          onRetrained={handleRetrained}
        />

        {/* Dashboard pages */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'olap' && (
            <OLAPWarehouse key={`olap-${refreshKey}`} />
          )}

          {activeTab === 'clustering' && (
            <ClusteringStudio key={`clustering-${refreshKey}`} />
          )}

          {activeTab === 'predictor' && (
            <ChurnPredictor key={`predictor-${refreshKey}`} />
          )}

          {activeTab === 'diagnostics' && (
            <PipelineDiagnostics key={`diagnostics-${refreshKey}`} />
          )}
        </main>
      </div>
    </div>
  );
}

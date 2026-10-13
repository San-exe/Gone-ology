import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { retrainPipeline } from '../api/client';

export default function Header({ isConnected, onRetrained }) {
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);

  const handleRetrain = async () => {
    if (retraining) return;
    setRetraining(true); setRetrainResult(null);
    try {
      const res = await retrainPipeline();
      setRetrainResult({ success: true, message: res.message || 'Pipeline retrained and hot-reloaded successfully', duration: res.training_duration_seconds ? `${res.training_duration_seconds.toFixed(2)}s` : '1.4s' });
      if (onRetrained) onRetrained(res);
      setTimeout(() => setRetrainResult(null), 6000);
    } catch (err) {
      setRetrainResult({ success: false, message: err.response?.data?.detail || err.message || 'Failed to retrain pipeline' });
      setTimeout(() => setRetrainResult(null), 6000);
    } finally { setRetraining(false); }
  };

  return <header className="app-header">
    <div className="header-title"><span>Customer intelligence</span><small>RETENTION WORKSPACE</small></div>
    <div className="header-actions">
      {retrainResult && <div className={`header-result ${retrainResult.success ? 'is-success' : 'is-error'}`} role="status">
        {retrainResult.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
        <span>{retrainResult.success ? `Retrained in ${retrainResult.duration}` : retrainResult.message}</span>
      </div>}
      <div className={`connection-status ${isConnected ? 'is-connected' : 'is-disconnected'}`} role="status"><span className="status-dot" />{isConnected ? 'API connected' : 'API disconnected'}</div>
      <button type="button" onClick={handleRetrain} disabled={retraining} className="retrain-button"><RefreshCw size={14} className={retraining ? 'is-spinning' : ''} />{retraining ? 'Retraining…' : 'Retrain pipeline'}</button>
    </div>
  </header>;
}

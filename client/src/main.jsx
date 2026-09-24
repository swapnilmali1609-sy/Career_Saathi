import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PrepAI Runtime Error Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: 600,
            width: '100%',
            background: '#111726',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: 16,
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: '#fb7185', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Application Render Error
            </h2>
            <p style={{ color: '#fca5a5', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', wordBreak: 'break-word' }}>
              {this.state.error.message || String(this.state.error)}
            </p>
            {this.state.error.stack && (
              <pre style={{
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: 8,
                padding: '0.85rem',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                overflow: 'auto',
                maxHeight: 200,
                marginBottom: '1.25rem'
              }}>
                {this.state.error.stack}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#262a35',
                  color: '#ffffff',
                  border: '1px solid #3d494c',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #06b6d4, #4cd7f6)',
                  color: '#003640',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

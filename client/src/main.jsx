import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SocketProvider from './components/SocketProvider.jsx';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';

const SocketProviderWrapper = ({ children }) => {
  const { listingId } = useParams();  

  if (listingId) {
    return (
      <SocketProvider listingId={listingId}>
        {children}
      </SocketProvider>
    );
  }
  
  return <SocketProvider>{children}</SocketProvider>;
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <SocketProviderWrapper>
          <App />
        </SocketProviderWrapper>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);

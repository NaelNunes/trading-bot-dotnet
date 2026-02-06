import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allPrices, setAllPrices] = useState({}); // ⬅️ NOVO: armazena todas as cotações
  const connectionRef = useRef(null);

  const cryptos = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
    'XRPUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
    'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'LTCUSDT', 'NEARUSDT',
    'APTUSDT', 'FILUSDT', 'ARBUSDT', 'OPUSDT', 'ICPUSDT'
  ];

  // 🔌 Conecta no SignalR uma única vez
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5280/cryptoHub') // ⬅️ CORRIGIDO
      .withAutomaticReconnect()
      .build();

    connection.on('ReceivePrice', (data) => { // ⬅️ CORRIGIDO
      console.log('📊 Recebido:', data); // ⬅️ ADICIONA pra ver no console
      
      // Armazena TODAS as cotações
      setAllPrices(prev => ({
        ...prev,
        [data.symbol]: data
      }));
      
      // Se for a crypto selecionada, atualiza
      if (data.symbol === cryptos[currentIndex]) {
        setCurrentQuotation(data);
        setLoading(false);
      }
    });

    connection.start()
      .then(() => {
        console.log('✅ Conectado ao SignalR');
      })
      .catch(err => {
        console.error('❌ Erro SignalR:', err);
        setLoading(false);
      });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, []); // ⬅️ Array vazio OK

  // 🔄 Quando trocar a crypto, atualiza com dados já armazenados
  useEffect(() => {
    const selectedSymbol = cryptos[currentIndex];
    
    if (allPrices[selectedSymbol]) {
      setCurrentQuotation(allPrices[selectedSymbol]);
      setLoading(false);
    } else {
      setLoading(true);
      setCurrentQuotation(null);
    }
  }, [currentIndex, allPrices]); // ⬅️ Depende de allPrices também

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const selectCrypto = (index) => {
    setCurrentIndex(index);
  };

  if (loading && !currentQuotation) {
    return (
      <div className="loading">
        <p>Conectando ao servidor...</p>
        <p>Aguardando primeira atualização de preços...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Mercados</h2>
        <div className="crypto-list">
          {cryptos.map((crypto, index) => (
            <div
              key={crypto}
              className={`crypto-item ${index === currentIndex ? 'active' : ''}`} // ⬅️ CORRIGIDO (template string)
              onClick={() => selectCrypto(index)}
            >
              <span className="crypto-name">{crypto.replace('USDT', '')}</span>
              <span className="crypto-pair">/USDT</span>
              {allPrices[crypto] && ( // ⬅️ NOVO: mostra preço na sidebar
                <span className="sidebar-price">
                  ${formatPrice(allPrices[crypto].price)}
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        {currentQuotation && (
          <>
            <div className="header">
              <div className="title-section">
                <h1>{currentQuotation.name}</h1>
                <span className="symbol">{currentQuotation.symbol}</span>
              </div>
            </div>

            <div className="price-section">
              <div className="current-price">
                <span className="price-label">Preço Atual</span>
                <span className="price-value">
                  ${formatPrice(currentQuotation.price)}
                </span>
                <span className="currency">{currentQuotation.currency}</span>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">Fonte</span>
                <span className="info-value">{currentQuotation.source}</span>
              </div>
              <div className="info-card">
                <span className="info-label">Atualização</span>
                <span className="info-value">
                  {formatTimestamp(currentQuotation.timestamp)}
                </span>
              </div>
            </div>

            <div className="chart-placeholder">
              <p>Área para gráfico (implementação futura)</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';

function App() {
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const cryptos = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'LTCUSDT', 'NEARUSDT', 'APTUSDT', 'FILUSDT', 'ARBUSDT', 'OPUSDT', 'ICPUSDT'];
  
  useEffect(() => {
    fetchQuotation(cryptos[currentIndex]);
  }, [currentIndex]);

  const fetchQuotation = async (crypto) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5280/api/quotation/${crypto}`);
      const data = await response.json();
      
      setCurrentQuotation(data);
    } catch (error) {
      console.error('Erro ao buscar cotação:', error);
  
    } finally {
      setLoading(false);
    }
  };

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
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Mercados</h2>
        <div className="crypto-list">
          {cryptos.map((crypto, index) => (
            <div
              key={crypto}
              className={`crypto-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => selectCrypto(index)}
            >
              <span className="crypto-name">{crypto.replace('USDT', '')}</span>
              <span className="crypto-pair">/{crypto.slice(-4)}</span>
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
                <span className="price-value">{formatPrice(currentQuotation.price)}</span>
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
                <span className="info-value">{formatTimestamp(currentQuotation.timestamp)}</span>
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

using System.Net.Http.Json;
using trading_bot_dotnet.Services.Interfaces;
using trading_bot_dotnet.DTOs;
using System.Threading.Tasks;

namespace trading_bot_dotnet.Services
{
    public class CryptoQuotationService : ICryptoQuotationService
    {

        private readonly HttpClient _httpClient;

        private readonly Dictionary<string, string> _cryptoSymbols = new()
        {
            { "BTCUSDT", "Bitcoin" },   
            { "ETHUSDT", "Ethereum" },
            { "ADAUSDT", "Cardano" },
            { "SOLUSDT", "Solana" },
            { "XRPUSDT", "Ripple" }
        };

        public CryptoQuotationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<CryptoQuotationResponseDto> GetQuotationAsync(string symbol)
        {

            var response = await _httpClient.GetAsync(
                $"api/v3/ticker/price?symbol={symbol.ToUpperInvariant()}");

            response.EnsureSuccessStatusCode();

            var raw = await response.Content.ReadFromJsonAsync<CryptoQuotationResponseDto>();

            if (raw is null)
            {
                throw new Exception("Failed to deserialize quotation response.");
            }

            return new CryptoQuotationResponseDto
            {
                Symbol = raw.Symbol,
                Name = _cryptoSymbols.GetValueOrDefault(raw.Symbol, "Unknown"),
                Currency = "USDT",
                Timestamp = DateTime.Today,
                Price = raw.Price,
                Source = "Binance"
            };
        }

    }

}




using Microsoft.AspNetCore.SignalR;
using trading_bot_dotnet.Hubs;
using trading_bot_dotnet.Services.Interfaces;

namespace trading_bot_dotnet.Services
{
    public class CryptoPriceUpdater : BackgroundService
    {
        private readonly IHubContext<CryptoHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CryptoPriceUpdater> _logger;

        public CryptoPriceUpdater(
                IHubContext<CryptoHub> hubContext,
                IServiceProvider serviceProvider,
                ILogger<CryptoPriceUpdater> logger)
        {
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de atualização de preços iniciado!");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Cria um scope pra usar o service (necessário em Background Service)
                    using var scope = _serviceProvider.CreateScope();
                    var quotationService = scope.ServiceProvider.GetRequiredService<ICryptoQuotationService>();

                    // Busca preços das principais moedas
                    var symbols = new[]
                    {
                        "BTCUSDT",
                        "ETHUSDT",
                        "BNBUSDT",
                        "SOLUSDT",
                        "ADAUSDT",
                        "XRPUSDT",
                        "DOGEUSDT",
                        "AVAXUSDT",
                        "DOTUSDT",
                        "MATICUSDT",
                        "LINKUSDT",
                        "UNIUSDT",
                        "ATOMUSDT",
                        "LTCUSDT",
                        "NEARUSDT",
                        "APTUSDT",
                        "FILUSDT",
                        "ARBUSDT",
                        "OPUSDT",
                        "ICPUSDT"
                    };

                    foreach (var symbol in symbols)
                    {
                        var price = await quotationService.GetQuotationAsync(symbol);

                        if (price != null)
                        {
                            // ENVIA pra TODOS os clientes conectados
                            await _hubContext.Clients.All.SendAsync("ReceivePrice", price, stoppingToken);
                            _logger.LogInformation($"{symbol}: ${price.Price}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao atualizar preços");
                }

                // Aguarda 5 segundos
                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}

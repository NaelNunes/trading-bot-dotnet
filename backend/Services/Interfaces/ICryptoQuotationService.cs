using trading_bot_dotnet.DTOs;

namespace trading_bot_dotnet.Services.Interfaces
{
    public interface ICryptoQuotationService
    {
        Task<CryptoQuotationResponseDto> GetQuotationAsync(string symbol);
    }

}
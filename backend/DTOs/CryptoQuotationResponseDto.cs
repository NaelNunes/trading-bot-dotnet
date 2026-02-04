namespace trading_bot_dotnet.DTOs
{
    public class CryptoQuotationResponseDto
    {
        public string Symbol { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Currency { get; set; } = null!;
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; }
        public String Source { get; set; } = null!;
    }
}

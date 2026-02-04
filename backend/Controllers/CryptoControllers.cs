using Microsoft.AspNetCore.Mvc;
using trading_bot_dotnet.DTOs;
using trading_bot_dotnet.Services.Interfaces;

namespace trading_bot_dotnet.Controllers
{
    [ApiController]
    [Route("api/quotation")]
    public class CryptoControllers : ControllerBase
    {
        private readonly ICryptoQuotationService _quotationService;

        public CryptoControllers(ICryptoQuotationService quotationService)
        {
            _quotationService = quotationService;
        }

        [HttpGet("{coin}")]
        public async Task<IActionResult> GetQuotation(string coin)
        {

            CryptoQuotationResponseDto quotation =  await _quotationService.GetQuotationAsync(coin);

            if (quotation is null)
            {
                return NotFound();
            }

            return Ok(quotation);

        }
    }
}

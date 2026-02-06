using trading_bot_dotnet.Services;
using trading_bot_dotnet.Services.Interfaces;
using trading_bot_dotnet.Hubs;
using Microsoft.AspNetCore.SignalR;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); 
    });
});

builder.Services.AddHttpClient<ICryptoQuotationService, CryptoQuotationService>(client =>
{
    client.BaseAddress = new Uri("https://api.binance.com/");
});

builder.Services.AddSignalR();

builder.Services.AddHostedService<CryptoPriceUpdater>();

var app = builder.Build();

app.UseCors();

app.MapHub<CryptoHub>("/cryptoHub");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


app.Run();

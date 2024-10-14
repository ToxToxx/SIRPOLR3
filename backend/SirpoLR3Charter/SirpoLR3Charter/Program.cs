using SirpoLR3Charter.DataAccess;
using SirpoLR3Charter.Interfaces;
using SirpoLR3Charter.Services;
using SoapCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddSingleton<ICharterService, CharterService>();
builder.Services.AddScoped<ChartersDbContext>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173");
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});

var app = builder.Build();

using var scope = app.Services.CreateScope();
await using var dbContext = scope.ServiceProvider
    .GetRequiredService<ChartersDbContext>();
await dbContext.Database.EnsureCreatedAsync();

app.UseSoapEndpoint<ICharterService>("/Service.asmx",
     new SoapEncoderOptions());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();

app.Run();

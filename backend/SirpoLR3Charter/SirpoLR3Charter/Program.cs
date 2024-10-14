using SirpoLR3Charter.DataAccess;
using SirpoLR3Charter.Interfaces;
using SirpoLR3Charter.Services;
using SoapCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<ICharterService, CharterService>();
builder.Services.AddScoped<ChartersDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
             builder => builder
                 .AllowAnyOrigin()
                 .AllowAnyMethod()
                 .AllowAnyHeader());
});

builder.Services.AddSoapCore();


var app = builder.Build();

using var scope = app.Services.CreateScope();
await using var dbContext = scope.ServiceProvider.GetRequiredService<ChartersDbContext>();
await dbContext.Database.EnsureCreatedAsync();

app.UseRouting();
app.UseCors("AllowAll");

app.UseSoapEndpoint<ICharterService>("/Service.asmx",
     new SoapEncoderOptions());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();


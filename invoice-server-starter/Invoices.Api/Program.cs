/*  _____ _______         _                      _
 * |_   _|__   __|       | |                    | |
 *   | |    | |_ __   ___| |___      _____  _ __| | __  ___ ____
 *   | |    | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 *  _| |_   | | | | |  __/ |_ \ V  V / (_) | |  |   < | (__ / /
 * |_____|  |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *
 *                      ___ ___ ___
 *                     | . |  _| . |  LICENCE
 *                     |  _|_| |___|
 *                     |_|
 *
 *    REKVALIFIKAČNÍ KURZY  <>  PROGRAMOVÁNÍ  <>  IT KARIÉRA
 *
 * Tento zdrojový kód je součástí profesionálních IT kurzů na
 * WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci PRO obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */

using Invoices.Api;
using Invoices.Api.Interfaces;
using Invoices.Api.Managers;
using Invoices.Data;
using Invoices.Data.Interfaces;
using Invoices.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using Scalar.AspNetCore;
using System.Globalization;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);



// Načtení connection stringu z appsettings.json
var connectionString = builder.Configuration.GetConnectionString("LocalInvoicesConnection");
// Registrace databázového kontextu s podporou Lazy Loading a potlačením varování

builder.Services.AddDbContext<InvoicesDbContext>(options =>
    options.UseSqlServer(connectionString)
        .UseLazyLoadingProxies()
        .ConfigureWarnings(x => x.Ignore(CoreEventId.LazyLoadOnDisposedContextWarning)));

// Konfigurace controllerů – přidání podpory pro výpis enumů jako stringů v JSONu
builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
//swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
    options.SwaggerDoc("invoices", new OpenApiInfo
    {
        Version = "v1",
        Title = "Invoices"
    }));


builder.Services.AddOpenApi();


// Dependency Injection – napojení repozitářů a managerů
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IInvoicesRepository,InvoiceRepository>();
// Dependency Injection – napojení  managerů
builder.Services.AddScoped<IPersonManager, PersonManager>();
builder.Services.AddScoped<IInvoiceManager, InvoiceManager>();
// AutoMapper – konfigurace mapování DTO <-> entity
builder.Services.AddAutoMapper(typeof(AutomapperConfigurationProfile));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("invoices/swagger.json", "Invoices - v1");
    });
 
    // Scalar – zde je správné místo!
    app.MapOpenApi(); // /openapi/v1.json
    app.MapScalarApiReference(); // /scalar/v1
}

app.MapGet("/", () => "Hello World!");
// Aktivace kontrolerů (routes)
app.MapControllers();

app.Run();

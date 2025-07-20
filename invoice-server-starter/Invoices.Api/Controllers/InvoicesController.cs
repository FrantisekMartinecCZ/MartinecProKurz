using Invoices.Api.Interfaces;
using Invoices.Api.Managers;
using Invoices.Api.Models;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Invoices.Api.Controllers;

// Tento controller zpracovává HTTP požadavky týkající se faktur.
// Odpovídá na URL začínající /api a využívá IInvoiceManager pro logiku.
[Route("api")]
[ApiController]
public class InvoicesController : ControllerBase
{
    // Napojený manager, který obsahuje logiku pro práci s fakturami.
    private readonly IInvoiceManager invoiceManager;

    private readonly ILogger<InvoicesController> _logger;

    // Konstruktor – získává manager přes dependency injection.
    public InvoicesController(IInvoiceManager invoiceManager, ILogger<InvoicesController> logger)
    {
        this.invoiceManager = invoiceManager;
        _logger = logger;
    }

    // GET /api/invoices
    // Vrací všechny faktury jako seznam DTO objektů nebo je možnost použít filtr
    //  [FromQuery] říká že lze napsat filtr do URL
    // Invoices.Api.Controllers/InvoicesController.cs
    [HttpGet("invoices")]
    public IActionResult GetInvoices(
        [FromQuery] ulong? buyerId,
        [FromQuery] ulong? sellerId,
        [FromQuery] string? product,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int? limit)
    {
        var filter = new InvoiceFilterDto
        {
            BuyerId = buyerId,
            SellerId = sellerId,
            Product = product,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            Limit = limit
        };

        var result = invoiceManager.GetAllInvoices(filter);
        return Ok(result);
    }




    // POST /api/invoices
    // Přidá novou fakturu. Tělo požadavku musí obsahovat InvoiceDto.
    // Vrací status 201 (Created) a nově vytvořenou fakturu.
    [HttpPost("invoices")]
    public IActionResult AddInvoice([FromBody] InvoiceDto invoice)
    {
        InvoiceDto? createdInvoice = invoiceManager.AddInvoice(invoice);
        if (createdInvoice == null)
        {
            return NotFound(new { message = "Kupující nebo prodávající nebyl nalezen nebo je skrytý." });
        }

        return StatusCode(StatusCodes.Status201Created, createdInvoice);
    }

    // GET /api/invoices/{invoiceId}
    // Vrací jednu fakturu podle ID. Pokud neexistuje, vrací 404 (Not Found).
    [HttpGet("invoices/{invoiceId}")]
    public IActionResult GetInvoice(ulong invoiceId)
    {
        InvoiceDto? invoice = invoiceManager.GetInvoice(invoiceId);

        if (invoice is null)
        {
            return NotFound();
        }

        return Ok(invoice);
    }

    // GET: api/identification/ico/purchases
    // Vypíše všechny faktury podle Ičo kde jsou faktury (kupující)

    [HttpGet("identification/{ico}/purchases")]
    public IActionResult GetPurchasesByIco(string ico)
    {
        // Získání seznamu faktur od invoiceManager, kde kupující má zadané IČO
        var invoices = invoiceManager.GetInvoicesByBuyerIdentification(ico);

        // Pokud nebyly nalezeny žádné faktury, vrátíme 404 Not Found s informativní zprávou
        if (!invoices.Any())
           return NotFound($"Žádné přijaté faktury pro IČO {ico} nebyly nalezeny.");

   /*  return NoContent();  */ 
        return Ok(invoices); //200
    }

    // GET: api/identification/ico/sales
    //Vypíše všechny faktury podle Ičo kde jsou faktury (prodávající)
    [HttpGet("identification/{ico}/sales")]
    public IActionResult GetSalesByIco(string ico)
    {

        // Získání seznamu faktur od invoiceManager, kde prodávající má zadané IČO
        var invoices = invoiceManager.GetInvoicesBySellerIdentification(ico);

        // Pokud nebyly nalezeny žádné faktury, vrátíme 404 Not Found s informativní zprávou
        if (!invoices.Any())
            return NotFound($"Žádné vystavené faktury pro IČO {ico} nebyly nalezeny.");

        return Ok(invoices);
    }

    [HttpPut("invoices/{invoiceId}")]
    public IActionResult UpdateInvoice(uint invoiceId, [FromBody] InvoiceDto invoiceDto)
    {
        InvoiceDto updated = invoiceManager.UpdateInvoice(invoiceId, invoiceDto);
        if (updated == null)
        {
            return NotFound();
        }

        return Ok(updated);

    }

    [HttpGet("invoices/statistics")]
    public ActionResult<InvoiceStatisticsDto> GetInvoiceStatistics()
    {
        var stats = invoiceManager.GetInvoiceStatistics();
        return Ok(stats);
    }

    // DELETE /api/invoices/{invoiceId}
    // Smaže fakturu podle ID. Pokud neexistuje, prostě nic neudělá.
    // Vrací status 204 (No Content).
    [HttpDelete("invoices/{invoiceId}")]
    public IActionResult DeleteInvoice(ulong invoiceId)
    {
        invoiceManager.DeleteInvoice(invoiceId);
        return NoContent();
    }
}

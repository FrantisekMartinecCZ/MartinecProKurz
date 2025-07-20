using Invoices.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Invoices.Api.Interfaces
{
    // Rozhraní IInvoiceManager definuje logiku pro práci s fakturami.
    // Implementuje ho třída InvoiceManager.
    public interface IInvoiceManager
    {
        // Vrací seznam všech faktur v databázi jako DTO objekty.
        List<InvoiceDto> GetAllInvoices(InvoiceFilterDto? invoiceFilterDto = null);

        // Vrací jednu konkrétní fakturu podle jejího ID.
        // Pokud faktura neexistuje, vrací null.
        InvoiceDto? GetInvoice(ulong invoiceId);

        // Přidá novou fakturu do databáze.
        // Vrací nově uloženou fakturu jako DTO.
        InvoiceDto AddInvoice(InvoiceDto invoiceDto);

        InvoiceDto? UpdateInvoice(uint invcoiceId, InvoiceDto invoiceDto);

        //
      

        // Vrátí seznam faktur, kde kupující má zadané IČO
        List<InvoiceDto> GetInvoicesByBuyerIdentification(string identificationNumber);

        // Vrátí seznam faktur, kde prodávající má zadané IČO
        List<InvoiceDto> GetInvoicesBySellerIdentification(string identificationNumber);

        InvoiceStatisticsDto GetInvoiceStatistics();



        // Smaže fakturu podle jejího ID (pokud existuje).
        void DeleteInvoice(ulong invoiceId);
    }

}

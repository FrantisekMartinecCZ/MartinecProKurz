using AutoMapper;
using Invoices.Api.Interfaces;
using Invoices.Api.Models;
using Invoices.Data;
using Invoices.Data.Interfaces;
using Invoices.Data.Models;
using Invoices.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Formats.Asn1;

namespace Invoices.Api.Managers;

// Třída InvoiceManager obsahuje logiku pro práci s fakturami.
// Spolupracuje s repozitáři a převádí data pomocí AutoMapperu.
public class InvoiceManager : IInvoiceManager
{
    // Repozitář pro práci s fakturami
    private readonly IInvoicesRepository invoiceRepository;

    // Repozitář pro práci s osobami (kvůli Buyer a Seller)
    private readonly IPersonRepository personRepository;

    // AutoMapper – převádí mezi Invoice a InvoiceDto
    private readonly IMapper mapper;

    // Konstruktor – předává závislosti přes DI (dependency injection)
    public InvoiceManager(IInvoicesRepository invoiceRepository, IPersonRepository personRepository, IMapper mapper)
    {
        this.invoiceRepository = invoiceRepository;
        this.personRepository = personRepository;
        this.mapper = mapper;
    }

    // Vrací všechny faktury v databázi jako seznam DTO objektů
    public List<InvoiceDto> GetAllInvoices(InvoiceFilterDto? invoiceFilterDto = null)
    {
        IList<Invoice> invoices;

        if (invoiceFilterDto is null)
        {
            invoices = invoiceRepository.GetAll();
        }
        else
        {
            invoices = invoiceRepository.GetFilteredInvoices(
                buyerId: invoiceFilterDto.BuyerId,
                sellerId: invoiceFilterDto.SellerId,
                product: invoiceFilterDto.Product,
                minPrice: invoiceFilterDto.MinPrice,
                maxPrice: invoiceFilterDto.MaxPrice,
                limit: invoiceFilterDto.Limit
            );
        }

        return mapper.Map<List<InvoiceDto>>(invoices);
    }





    public InvoiceDto? UpdateInvoice(uint invoiceId, InvoiceDto invoiceDto)
    {
        Invoice invoice = mapper.Map<Invoice>(invoiceDto);

        invoice.InvoiceId = invoiceId;

        // OPRAVENO: použij BuyerId/SellerId
        var buyer = personRepository.FindById(invoiceDto.BuyerId ?? 0);
        var seller = personRepository.FindById(invoiceDto.SellerId ?? 0);

        if (invoiceDto.DueDate < invoiceDto.Issued)
            throw new ArgumentException("Datum splatnosti musí být později než datum vystavení.");

        if (buyer == null || seller == null)
            return null;

        invoice.Buyer = buyer;
        invoice.Seller = seller;

        Invoice updatedInvoice = invoiceRepository.Update(invoice);

        return mapper.Map<InvoiceDto>(updatedInvoice);
    }


    public InvoiceStatisticsDto GetInvoiceStatistics()
    {
       var invoices = invoiceRepository.GetAll();
        var currentYear = DateTime.Now.Year;

        // Součet za aktuální rok
        var currentYearSum = invoices
            .Where(i => i.Issued.Year == currentYear)
            .Sum(i => i.Price);
        // Součet za všechna období
        var allTimeSum = invoices.Sum(i => i.Price);

        // Počet faktur
        var count = invoices.Count;

        // Vrátíme výsledek jako DTO
        return new InvoiceStatisticsDto
        {
            CurrentYearSum = currentYearSum,
            AllTimeSum = allTimeSum,
            InvoicesCount = count
        };


    }

    /// <summary>
    /// Vrátí všechny faktury, jejichž kupující má dané IČO.
    /// </summary>
    public List<InvoiceDto> GetInvoicesByBuyerIdentification(string identificationNumber)
    {
        // Vyfiltruje faktury, kde kupující má dané IČO
        // dej do proměnné invoices všechny faktury ale kde je kupující podle Ičo a ulož to do listu
        var invoices = invoiceRepository.GetAll()
            .Where(i => i.Buyer.IdentificationNumber == identificationNumber)
            .ToList();
            
        // Převede seznam entit na DTO a převedeme na List
        return mapper.Map<List<InvoiceDto>>(invoices);
    }

    /// <summary>
    /// Vrátí všechny faktury, jejichž prodávající má dané IČO.
    /// </summary>
    public List<InvoiceDto> GetInvoicesBySellerIdentification(string identificationNumber)
    {
        // dej do proměnné invoices všechny faktury ale kde je prodávající podle Ičo a ulož to do listu
        var invoices = invoiceRepository.GetAll()
            .Where(i => i.Seller.IdentificationNumber == identificationNumber)
            .ToList();
        // Převedeme seznam entit na DTO a převedeme na List
        return mapper.Map<List<InvoiceDto>>(invoices);
    }




    // Přidá novou fakturu do databáze.
    // Nejdříve najde kupujícího a prodávajícího podle ID z DTO.
    // Přidá novou fakturu do databáze.
    public InvoiceDto AddInvoice(InvoiceDto invoiceDto)
    {
        // OPRAVENO: použij BuyerId/SellerId
        Person? buyer = personRepository.FindById(invoiceDto.BuyerId ?? 0);
        Person? seller = personRepository.FindById(invoiceDto.SellerId ?? 0);

        if (invoiceDto.DueDate < invoiceDto.Issued)
            throw new ArgumentException("Datum splatnosti musí být později než datum vystavení.");

        if (buyer is null || seller is null)
            throw new Exception("Kupující nebo prodavající nejsou k nalezení.");

        if (buyer.Hidden || seller.Hidden)
            throw new Exception("Kupující nebo prodavající už u nás nejsou");

        Invoice invoice = mapper.Map<Invoice>(invoiceDto);

        invoice.BuyerId = buyer.PersonId;
        invoice.SellerId = seller.PersonId;
        invoice.Buyer = buyer;
        invoice.Seller = seller;

        Invoice addedInvoice = invoiceRepository.Insert(invoice);

        return mapper.Map<InvoiceDto>(addedInvoice);
    }




    /// <summary>
    /// Vrátí jednu fakturu podle jejího ID.
    /// </summary>
    /// <param name="invoiceId">Identifikátor faktury (ID typu ulong).</param>
    /// <returns>
    /// DTO objekt faktury, pokud existuje; jinak <c>null</c>.
    /// </returns>
    public InvoiceDto? GetInvoice(ulong invoiceId)
    {
        // Najdeme fakturu v databázi podle ID
        var invoice = invoiceRepository.FindById(invoiceId);

        // Pokud nebyla nalezena, vrátíme null
        if (invoice == null)
            return null;

        // Převedeme entitu na DTO a vrátíme
        return mapper.Map<InvoiceDto>(invoice);
    }




    // Smaže fakturu podle ID (pokud existuje)
    public void DeleteInvoice(ulong invoiceId)
    {
        Invoice? invoice = invoiceRepository.FindById(invoiceId);

        if (invoice is null)
            return;

        invoiceRepository.Delete(invoice.InvoiceId);
    }
}

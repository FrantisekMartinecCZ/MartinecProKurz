using Invoices.Data.Interfaces;
using Invoices.Data.Models;

namespace Invoices.Data.Repositories;

// Třída pro práci s databázovou tabulkou faktur(Invoice).
// Dědí základní metody z BaseRepository a implementuje vlastní rozhraní IInvoiceRepository.
public class InvoiceRepository : BaseRepository<Invoice>, IInvoicesRepository
{
    // Konstruktor repozitáře pro faktury.
    // Přijímá databázový kontext a předává ho do základního repozitáře (BaseRepository).
    public InvoiceRepository(InvoicesDbContext invoicesDbContext) : base(invoicesDbContext)
    {
    }

    public IList<Invoice> GetFilteredInvoices( 
        ulong? buyerId = null,
     ulong? sellerId = null,
      string? product  = null,
      decimal? minPrice = null,
      decimal? maxPrice = null,
  int? limit = null)
    {
        IQueryable<Invoice> query = dbSet;

        if (buyerId is not null)
            query = query.Where(i => i.BuyerId == buyerId);

        if (sellerId is not null)
            query = query.Where(i => i.SellerId == sellerId);

        if (!string.IsNullOrWhiteSpace(product))
            query = query.Where(i => i.Product != null && i.Product.Contains(product));

        if (minPrice is not null)
            query = query.Where(i => i.Price >= minPrice.Value);

        if (maxPrice is not null)
            query = query.Where(i => i.Price <= maxPrice.Value);

        if (limit is not null && limit > 0)
            query = query.Take(limit.Value);

        return query.ToList();
    }


}
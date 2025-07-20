using Invoices.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Invoices.Data.Interfaces
{
    // Rozhraní pro práci s entitou Invoice (faktura).
    public interface IInvoicesRepository : IBaseRepository<Invoice>
    {
        public IList<Invoice> GetFilteredInvoices(
          ulong? buyerId = null,
       ulong? sellerId = null,
        string? product = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
    int? limit = null);
    }


}

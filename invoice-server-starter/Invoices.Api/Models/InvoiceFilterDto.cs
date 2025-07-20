namespace Invoices.Api.Models
{
    public class InvoiceFilterDto
    {
        public ulong? BuyerId { get; set; }
        public ulong? SellerId { get; set; }
        public string? Product { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Limit { get; set; }
    }
}
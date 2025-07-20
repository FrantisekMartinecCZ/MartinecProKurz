namespace Invoices.Api.Models
{
    public class InvoiceStatisticsDto

    {
        /// <summary>
        /// letoční rok
        /// </summary>
        public decimal? CurrentYearSum { get; set; }
        /// <summary>
        /// všechny roky
        /// </summary>
        public decimal? AllTimeSum { get;set; }

        /// <summary>
        /// počet faktur
        /// </summary>
        public int? InvoicesCount { get; set;}
    }
}

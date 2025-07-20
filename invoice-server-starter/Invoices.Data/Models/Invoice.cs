using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Invoices.Data.Models
{
    /// <summary>
    /// Reprezentuje fakturu, která obsahuje informace o produktu, ceně,
    /// datu vystavení a splatnosti, kupujícím a prodávajícím.
    /// </summary>
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public ulong InvoiceId { get; set; }

        [Required(ErrorMessage = "Číslo faktury je povinné.")]
        public int InvoiceNumber { get; set; }

        [Required(ErrorMessage = "Datum vystavení je povinné.")]
        public DateTime Issued { get; set; }

        [Required(ErrorMessage = "Datum splatnosti je povinné.")]
        public DateTime DueDate { get; set; }

        [Required(ErrorMessage = "Popis produktu je povinný.")]
        [StringLength(200, ErrorMessage = "Popis může mít maximálně 200 znaků.")]
        public string Product { get; set; } = string.Empty;

        [Required(ErrorMessage = "Cena je povinná.")]
        [Range(1, 999999999, ErrorMessage = "Cena musí být kladné číslo.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "DPH je povinné.")]
        [Range(0, 100, ErrorMessage = "DPH musí být mezi 0 a 100 %.")]
        public int Vat { get; set; }

        [StringLength(500, ErrorMessage = "Poznámka může mít maximálně 500 znaků.")]
        public string Note { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kupující je povinný.")]
        public ulong? BuyerId { get; set; }

        [Required(ErrorMessage = "Prodávající je povinný.")]
        public ulong? SellerId { get; set; }

        [ForeignKey(nameof(BuyerId))]
        public virtual Person Buyer { get; set; } = null!;

        [ForeignKey(nameof(SellerId))]
        public virtual Person Seller { get; set; } = null!;
    }
}

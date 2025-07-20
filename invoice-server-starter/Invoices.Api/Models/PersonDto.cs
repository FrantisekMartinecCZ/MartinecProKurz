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

using Invoices.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Invoices.Api.Models;

/// <summary>
/// DTO (Data Transfer Object) pro třídu Person.
/// Používá se pro přenos dat mezi API a klientem.
/// Obsahuje stejné validační atributy jako databázový model pro konzistenci.
/// </summary>
public class PersonDto
{
    [JsonPropertyName("_id")]
    public ulong PersonId { get; set; }

    [Required(ErrorMessage = "Jméno je povinné.")]
    [StringLength(100, ErrorMessage = "Jméno může mít maximálně 100 znaků.")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "IČO je povinné.")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "IČO musí obsahovat přesně 8 číslic.")]
    public string IdentificationNumber { get; set; } = "";

    [RegularExpression(@"^[A-Z]{2}\d{8,10}$", ErrorMessage = "DIČ musí být ve formátu CZ12345678 nebo SK1234567890.")]

    public string TaxNumber { get; set; } = "";

    [Required(ErrorMessage = "Číslo účtu je povinné.")]
    [StringLength(20)]
    public string AccountNumber { get; set; } = "";

    [Required(ErrorMessage = "Kód banky je povinný.")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Kód banky musí obsahovat přesně 4 číslice.")]
    public string BankCode { get; set; } = "";

    [Required(ErrorMessage = "IBAN je povinný.")]
    [StringLength(34, ErrorMessage = "IBAN může mít maximálně 34 znaků.")]
    public string Iban { get; set; } = "";

    [Phone(ErrorMessage = "Neplatný formát telefonního čísla.")]
    public string Telephone { get; set; } = "";

    [Required(ErrorMessage = "E-mail je povinný.")]
    [EmailAddress(ErrorMessage = "Neplatný formát e-mailové adresy.")]
    public string Mail { get; set; } = "";

    [Required(ErrorMessage = "Ulice je povinná.")]
    [StringLength(100)]
    public string Street { get; set; } = "";

    [Required(ErrorMessage = "PSČ je povinné.")]
    [RegularExpression(@"^\d{5}$", ErrorMessage = "PSČ musí obsahovat přesně 5 číslic.")]
    public string Zip { get; set; } = "";

    [Required(ErrorMessage = "Město je povinné.")]
    [StringLength(100)]
    public string City { get; set; } = "";

    public string Note { get; set; } = "";

    [Required(ErrorMessage = "Země je povinná.")]
    public Country Country { get; set; }
}

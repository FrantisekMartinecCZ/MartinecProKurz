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

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Invoices.Data.Models;

/// <summary>
/// Reprezentuje osobu v systému – může být nakupující nebo prodávající.
/// Uchovává veškeré fakturační a kontaktní údaje.
/// </summary>
/// <summary>
/// Reprezentuje osobu v systému – může být nakupující nebo prodávající.
/// Uchovává veškeré fakturační a kontaktní údaje s přidanou validací.
/// </summary>
public class Person
{
    /// <summary>
    /// Primární klíč – ID osoby, generované databází.
    /// </summary>
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public ulong PersonId { get; set; }

    /// <summary>
    /// Celé jméno osoby nebo firmy.
    /// </summary>
    [Required(ErrorMessage = "Jméno je povinné.")]
    [StringLength(100, ErrorMessage = "Jméno může mít maximálně 100 znaků.")]
    public string Name { get; set; } = "";

    /// <summary>
    /// Identifikační číslo (např. IČO).
    /// </summary>
    [Required(ErrorMessage = "IČO je povinné.")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "IČO musí obsahovat přesně 8 číslic.")]
    public string IdentificationNumber { get; set; } = "";

    /// <summary>
    /// Daňové identifikační číslo (např. DIČ).
    /// Může být prázdné, pokud osoba není plátce DPH.
    /// </summary>
    [RegularExpression(@"^[A-Z]{2}\d{8,10}$", ErrorMessage = "DIČ musí být ve formátu CZ12345678 nebo SK1234567890.")]

    public string TaxNumber { get; set; } = "";

    /// <summary>
    /// Číslo bankovního účtu.
    /// </summary>
    [Required(ErrorMessage = "Číslo účtu je povinné.")]
    [StringLength(20)]
    public string AccountNumber { get; set; } = "";

    /// <summary>
    /// Kód banky, ke které patří účet.
    /// </summary>
    [Required(ErrorMessage = "Kód banky je povinný.")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Kód banky musí obsahovat přesně 4 číslice.")]
    public string BankCode { get; set; } = "";

    /// <summary>
    /// IBAN – mezinárodní číslo účtu.
    /// </summary>
    [Required(ErrorMessage = "IBAN je povinný.")]
    [StringLength(34, ErrorMessage = "IBAN může mít maximálně 34 znaků.")]
    public string Iban { get; set; } = "";

    /// <summary>
    /// Telefonní číslo osoby.
    /// </summary>
    [Phone(ErrorMessage = "Neplatný formát telefonního čísla.")]
    public string Telephone { get; set; } = "";

    /// <summary>
    /// E-mailová adresa.
    /// </summary>
    [Required(ErrorMessage = "E-mail je povinný.")]
    [EmailAddress(ErrorMessage = "Neplatný formát e-mailové adresy.")]
    public string Mail { get; set; } = "";

    /// <summary>
    /// Ulice a číslo popisné/směrovací.
    /// </summary>
    [Required(ErrorMessage = "Ulice je povinná.")]
    [StringLength(100)]
    public string Street { get; set; } = "";

    /// <summary>
    /// PSČ (poštovní směrovací číslo).
    /// </summary>
    [Required(ErrorMessage = "PSČ je povinné.")]
    [RegularExpression(@"^\d{5}$", ErrorMessage = "PSČ musí obsahovat přesně 5 číslic.")]
    public string Zip { get; set; } = "";

    /// <summary>
    /// Město nebo obec.
    /// </summary>
    [Required(ErrorMessage = "Město je povinné.")]
    [StringLength(100)]
    public string City { get; set; } = "";

    /// <summary>
    /// Poznámka k osobě (interní informace).
    /// </summary>
    public string Note { get; set; } = "";

    /// <summary>
    /// Země, ke které osoba patří.
    /// </summary>
    [Required(ErrorMessage = "Země je povinná.")]
    public Country Country { get; set; }

    /// <summary>
    /// Příznak, zda má být osoba skryta (např. archivovaná).
    /// </summary>
    public bool Hidden { get; set; } = false;

    // Navigační vlastnosti – faktury, kde je osoba kupujícím
    public virtual List<Invoice> Purchases { get; set; } = new List<Invoice>();

    // Navigační vlastnosti – faktury, kde je osoba prodávajícím
    public virtual List<Invoice> Sales { get; set; } = new List<Invoice>();
}

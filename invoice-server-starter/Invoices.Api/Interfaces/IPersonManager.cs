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

using Invoices.Api.Models;

namespace Invoices.Api.Interfaces;

// Rozhraní IPersonManager definuje logiku pro práci s osobami.
// Implementuje ho třída PersonManager.
public interface IPersonManager
{
    // Vrací seznam všech neskrytých osob (Hidden == false).
    IList<PersonDto> GetAllPersons();

    // Přidá novou osobu na základě zadaného DTO.
    // Vrací přidanou osobu jako DTO.
    PersonDto AddPerson(PersonDto personDto);

    // Aktualizuje osobu s daným ID, pokud existuje a má stejné IČ.
    // Vrací upravenou osobu nebo null, pokud osoba neexistuje nebo IČ nesouhlasí.
    PersonDto? UpdatePerson(uint personId, PersonDto personDto);

    // Skryje osobu (neprovádí fyzické smazání).
    void DeletePerson(uint personId);

    // Vrátí jednu osobu podle ID, pokud existuje.
    PersonDto? GetPerson(ulong personId);

    /// <summary>
    /// Vrací faktury, které osoba vystavila (je prodávajícím).
    /// </summary>
    /// <param name="personId">ID osoby</param>
    /// <returns>Seznam vystavených faktur</returns>
    IEnumerable<InvoiceDto> GetInvoicesIssued(uint personId);

    /// <summary>
    /// Vrací faktury, které osoba přijala (je kupujícím).
    /// </summary>
    /// <param name="personId">ID osoby</param>
    /// <returns>Seznam přijatých faktur</returns>
    IEnumerable<InvoiceDto> GetInvoicesReceived(uint personId);
    List<PersonStatisticsDto> GetAllPersonStatistics();


}

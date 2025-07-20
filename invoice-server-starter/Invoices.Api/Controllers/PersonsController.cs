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

using Invoices.Api.Interfaces;
using Invoices.Api.Managers;
using Invoices.Api.Models;
using Invoices.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace Invoices.Api.Controllers;

// Tento controller zpracovává HTTP požadavky pro práci s osobami.
// Odpovídá na URL začínající /api a používá IPersonManager pro logiku.
[Route("api")]
[ApiController]
public class PersonsController : ControllerBase
{
    // Napojený manažer, který zajišťuje logiku pro osoby.
    private readonly IPersonManager personManager;

    // Konstruktor – dostane manager přes dependency injection.
    public PersonsController(IPersonManager personManager)
    {
        this.personManager = personManager;
    }

    // GET /api/persons
    // Vrací všechny neskryté osoby (Hidden == false).
    [HttpGet("persons")]
    public IEnumerable<PersonDto> GetPersons()
    {
        return personManager.GetAllPersons();
    }

    // POST /api/persons
    // Přidá novou osobu. Tělo požadavku musí obsahovat PersonDto.
    // Vrací status 201 (Created) a přidanou osobu.
    [HttpPost("persons")]
    public IActionResult AddPerson([FromBody] PersonDto person)
    {
        PersonDto? createdPerson = personManager.AddPerson(person);
        return StatusCode(StatusCodes.Status201Created, createdPerson);
    }

    // GET /api/persons/{personId}
    // Vrátí konkrétní osobu podle ID.
    // Pokud osoba neexistuje, vrací 404 (Not Found).
    // pokud osoba existuje, vrací 200 (OK)
    [HttpGet("persons/{personId}")]
    public IActionResult GetPerson(ulong personId)
    {
        PersonDto? person = personManager.GetPerson(personId);

        if (person is null)
        {
            return NotFound();
        }

        return Ok(person);
    }

    //
    [HttpGet("persons/statistics")]
    public ActionResult<PersonStatisticsDto> GetAllPersonStatistics()
    {
        var stats = personManager.GetAllPersonStatistics();

        if (!stats.Any())
            return NoContent();

        return Ok(stats);
    }


    // PUT /api/persons/{personId}
    // Aktualizuje osobu. Pokud osoba neexistuje nebo nesouhlasí IČ, vrací 404.
    [HttpPut("persons/{personId}")]
    public IActionResult UpdatePerson(uint personId, [FromBody] PersonDto person)
    {
        PersonDto? updated = personManager.UpdatePerson(personId, person);

        if (updated == null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    // GET /api/persons/{personId}/invoices-issued
    // Vrací všechny faktury, které daná osoba vystavila (je prodávajícím).
    // Pokud žádné neexistují, vrací 404 s hláškou.
    [HttpGet("persons/{personId}/invoices-issued")]
    public IActionResult GetInvoicesIssued(uint personId)
    {
        var invoices = personManager.GetInvoicesIssued(personId);

        if (!invoices.Any())
            return NotFound("Žádné vystavené faktury nebyly nalezeny.");

        return Ok(invoices);
    }

    // GET /api/persons/{personId}/invoices-received
    // Vrací všechny faktury, které daná osoba přijala (je kupujícím).
    // Pokud žádné neexistují, vrací 404 s hláškou.
    [HttpGet("persons/{personId}/invoices-received")]
    public IActionResult GetInvoicesReceived(uint personId)
    {
        var invoices = personManager.GetInvoicesReceived(personId);

        if (!invoices.Any())
            return NotFound("Žádné přijaté faktury nebyly nalezeny.");

        return Ok(invoices);
    }




    // DELETE /api/persons/{personId}
    // Skryje osobu nastavením Hidden = true. Neprovádí fyzické smazání.
    // Vrací status 204 (No Content).
    [HttpDelete("persons/{personId}")]
    public IActionResult DeletePerson(uint personId)
    {
        personManager.DeletePerson(personId);
        return NoContent();
    }
}

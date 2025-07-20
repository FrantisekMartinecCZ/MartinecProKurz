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

using AutoMapper;
using Invoices.Api.Interfaces;
using Invoices.Api.Models;
using Invoices.Data.Interfaces;
using Invoices.Data.Models;
using Invoices.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Invoices.Api.Managers;

// Třída PersonManager zajišťuje logiku pro práci s osobami.
// Volá metody repozitáře a převádí entity na DTO pomocí AutoMapperu.
public class PersonManager : IPersonManager
{
    // Repozitář pro práci s osobami (napojení na databázi)
    private readonly IPersonRepository personRepository;

    // AutoMapper pro převody mezi Person a PersonDto
    private readonly IMapper mapper;

    private readonly IInvoicesRepository invoicesRepository;

    // Konstruktor – přijímá repozitář a mapovač
    public PersonManager(IPersonRepository personRepository,IInvoicesRepository invoicesRepository ,IMapper mapper)
    {
        this.personRepository = personRepository;
        this.mapper = mapper;
        this.invoicesRepository = invoicesRepository;
    }

    // Vrací seznam všech neskrytých osob jako PersonDto
    public IList<PersonDto> GetAllPersons()
    {
        IList<Person> persons = personRepository.GetAllByHidden(false);
        return mapper.Map<IList<PersonDto>>(persons);
    }

    // Vrací jednu osobu podle ID (pokud existuje), převedenou na DTO
    public PersonDto? GetPerson(ulong PersonId)
    {
        Person? person = personRepository.FindById(PersonId);
        if (person == null)
        {
            return null;
        }
        return mapper.Map<PersonDto>(person);
    }

    // Přidá novou osobu – přijímá DTO, uloží do DB a vrací zpět DTO
    public PersonDto AddPerson(PersonDto personDto)
    {
        Person person = mapper.Map<Person>(personDto);
        person.PersonId = default; // vynulujeme ID, protože databáze ho vytvoří automaticky
        Person addedPerson = personRepository.Insert(person);
        //PersonDto addedPersonDto = mapper.Map<PersonDto>(addedPerson);
        //retrun addedPersonDto;
        return mapper.Map<PersonDto>(addedPerson);
    }

    // Skryje (nezmaže) osobu podle ID
    public void DeletePerson(uint personId)
    {
        HidePerson(personId);
    }

    // Aktualizuje osobu – pouze pokud má stejné IČ jako originál
    public PersonDto? UpdatePerson(uint personId, PersonDto personDto)
    {
        var person = personRepository.FindById(personId);
        if (person == null)
            return null;

        if (person.IdentificationNumber != personDto.IdentificationNumber)
            return null;

        mapper.Map(personDto, person); // Zkopíruje všechny properties z DTO do entity
        Person updatedPerson = personRepository.Update(person);

        return mapper.Map<PersonDto>(updatedPerson);
    }

    /// <summary>
    /// Vrací seznam faktur, které osoba vystavila (je prodávajícím).
    /// </summary>
    public IEnumerable<InvoiceDto> GetInvoicesIssued(uint personId)
    {
        // Získáme všechny faktury z databáze a vyfiltrujeme ty, kde je osoba prodávajícím (Seller)
        var issuedInvoices = invoicesRepository.GetAll()
            .Where(i => i.Seller.PersonId == personId);

        // Pomocí AutoMapperu převedeme entity Invoice na DTO objekty InvoiceDto
        return mapper.Map<IEnumerable<InvoiceDto>>(issuedInvoices);
    }

    /// <summary>
    /// Vrací seznam faktur, které osoba přijala (je kupujícím).
    /// </summary>
    public IEnumerable<InvoiceDto> GetInvoicesReceived(uint personId)
    {
        // Získáme všechny faktury z databáze a vyfiltrujeme ty, kde je osoba kupujícím (Buyer)
        var receivedInvoices = invoicesRepository.GetAll()
            .Where(i => i.Buyer.PersonId == personId);

        // Pomocí AutoMapperu převedeme entity Invoice na DTO objekty InvoiceDto
        return mapper.Map<IEnumerable<InvoiceDto>>(receivedInvoices);
    }

    //
    public List<PersonStatisticsDto> GetAllPersonStatistics()
    {
        var persons = personRepository.GetAll();

        var result = persons.Select(person => new PersonStatisticsDto
        {
            PersonId = (uint)person.PersonId,
            PersonName = person.Name,
            Revenue = person.Sales.Sum(i => i.Price)
        }).ToList();

        return result;
    }




    // Pomocná metoda – nastaví osobu jako skrytou (Hidden = true)
    private Person? HidePerson(uint personId)
    {
        Person? person = personRepository.FindById(personId);

        if (person is null)
            return null;

        person.Hidden = true;
        return personRepository.Update(person);
    }
}

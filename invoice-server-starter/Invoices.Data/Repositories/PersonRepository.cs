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

using Invoices.Data.Interfaces;
using Invoices.Data.Models;

namespace Invoices.Data.Repositories;

// Třída pro práci s databázovou tabulkou osob (Person).
// Dědí základní metody z BaseRepository a implementuje vlastní rozhraní IPersonRepository.
public class PersonRepository : BaseRepository<Person>, IPersonRepository
{
    // Konstruktor repozitáře pro osoby.
    // Přijímá databázový kontext a předává ho do základního repozitáře (BaseRepository).
    public PersonRepository(InvoicesDbContext invoicesDbContext)
        : base(invoicesDbContext)
    {
    }

    // Vrací seznam osob podle toho, zda mají vlastnost Hidden true nebo false.
    public IList<Person> GetAllByHidden(bool hidden)
    {
        return dbSet
            .Where(p => p.Hidden == hidden)  // filtruje osoby podle toho, co je v parametru
            .ToList();                        // převede výsledek na seznam
    }


}
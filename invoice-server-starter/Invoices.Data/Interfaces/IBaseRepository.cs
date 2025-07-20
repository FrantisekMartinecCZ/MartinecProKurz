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

namespace Invoices.Data.Interfaces;

// Základní rozhraní pro práci s libovolnou entitou (např. Person, Invoice).
// Obsahuje běžné metody pro čtení, přidání, úpravu a smazání dat.
public interface IBaseRepository<TEntity> where TEntity : class
{
    // Vrací všechny záznamy dané entity z databáze.
    IList<TEntity> GetAll(
        
        );

    // Najde záznam podle jeho ID.
    // Pokud záznam neexistuje, vrátí null.
    TEntity? FindById(ulong id);

    // Vloží nový záznam do databáze a vrátí ho zpět.
    TEntity Insert(TEntity entity);

    // Aktualizuje existující záznam v databázi a vrátí upravený objekt.
    TEntity Update(TEntity entity);

    // Smaže záznam podle jeho ID.
    void Delete(ulong id);

    // Vrací true, pokud záznam s daným ID existuje.
    // Jinak vrací false.
    bool ExistsWithId(ulong id);
}

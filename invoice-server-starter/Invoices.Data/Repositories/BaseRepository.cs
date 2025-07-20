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
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Invoices.Data.Repositories;

// Základní (generický) repozitář pro práci s libovolnou entitou (např. Person, Invoice...).
public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
{
    // Odkaz na databázový kontext, který se používá ke komunikaci s databází.
    protected readonly InvoicesDbContext invoicesDbContext;

    // DbSet představuje "tabulku" v databázi pro konkrétní entitu.
    // Například: DbSet<Person> nebo DbSet<Invoice>
    protected readonly DbSet<TEntity> dbSet;

    // Konstruktor repozitáře – přijímá databázový kontext a nastaví s ním práci.
    public BaseRepository(InvoicesDbContext invoicesDbContext)
    {
        this.invoicesDbContext = invoicesDbContext;
        dbSet = invoicesDbContext.Set<TEntity>(); // Tímto říkáme EF: "dej mi tabulku pro tento typ entity"
    }
    // Třída funguje pro jakýkoliv typ entity (TEntity), který je třída (class).
    // Poskytuje běžné metody jako najít, vložit, smazat apod.
    public TEntity? FindById(ulong id)
    {
        return dbSet.Find(id);
    }

    public bool ExistsWithId(ulong id)
    {
        TEntity? entity = dbSet.Find(id);
        if (entity is not null)
            invoicesDbContext.Entry(entity).State = EntityState.Detached;
        return entity is not null;
    }

    public IList<TEntity> GetAll()
    {
        return dbSet.ToList();
    }

    public TEntity Insert(TEntity entity)
    {
        EntityEntry<TEntity> entityEntry = dbSet.Add(entity);
        invoicesDbContext.SaveChanges();
        return entityEntry.Entity;
    }

    public TEntity Update(TEntity entity)
    {
        EntityEntry<TEntity> entityEntry = dbSet.Update(entity);
        invoicesDbContext.SaveChanges();
        return entityEntry.Entity;
    }

    public void Delete(ulong id)
    {
        TEntity? entity = dbSet.Find(id);

        if (entity is null)
            return;

        try
        {
            dbSet.Remove(entity);
            invoicesDbContext.SaveChanges();
        }
        catch
        {
            invoicesDbContext.Entry(entity).State = EntityState.Unchanged;
            throw;
        }
    }
}
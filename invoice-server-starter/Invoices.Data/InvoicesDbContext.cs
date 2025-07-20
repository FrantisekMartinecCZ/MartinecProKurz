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
using Microsoft.EntityFrameworkCore;

namespace Invoices.Data;

public class InvoicesDbContext : DbContext
{
    public DbSet<Person>? Persons { get; set; } // Reprezentuje tabulku osob v databázi (vytvoří se při migraci)

    public DbSet<Invoice>? Invoices { get; set; } // Reprezentuje tabulku faktur v databázi (vytvoří se při migraci)


    /// <summary>
    /// Tento konstruktor nastaví připojení k databázi.
    /// </summary>
    /// <param name="options">
    /// Nastavení databáze – sem se automaticky pošle, co jsme nastavili v Program.cs.
    /// </param>
    public InvoicesDbContext(DbContextOptions<InvoicesDbContext> options)
        : base(options)
    {
    }

    // Tato metoda se volá při vytváření databázového modelu.
    // Tady nastavujeme vztahy mezi tabulkami (např. kdo je kupující, kdo prodávající atd.).
    // Přepisujeme výchozí chování Entity Frameworku pomocí 'override'.
    protected override void OnModelCreating(ModelBuilder modelBuilder)

    {
        // Nastavíme typ sloupce TPrice jako decimal(10,2):
        modelBuilder.Entity<Invoice>()
            .Property(x => x.Price)              // Vlastnost Price představuje celkovou cenu faktury
            .HasColumnType("decimal(10,2)");     // Bude uložena jako decimal s přesností 10 číslic, z toho 2 desetinná místa



        // Nastavíme vztah mezi fakturou a kupujícím:
        modelBuilder.Entity<Invoice>()
     .HasOne(i => i.Buyer)             // Jedna faktura má jednoho kupujícího (Buyer)
     .WithMany(p => p.Purchases)      // Jedna osoba (Person) může být kupujícím na více fakturách (Purchases)
       .HasForeignKey(i => i.BuyerId) // Ve faktuře je cizí klíč BuyerId, který odkazuje na osobu
        .OnDelete(DeleteBehavior.Restrict); // Při pokusu o smazání osoby nedojde k automatickému smazání faktur


        // Nastavíme vztah mezi fakturou a prodávajícím:
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Seller)    // Jedna faktura má jednoho prodávajícího (Seller)
            .WithMany(p => p.Sales)   // Jedna osoba (Person) může být prodávajícím na více fakturách (Sales)
            .HasForeignKey(i => i.SellerId) // Ve faktuře je cizí klíč SellerId, který odkazuje na osobu
            .OnDelete(DeleteBehavior.Restrict); // Při pokusu o smazání osoby nedojde k automatickému smazání faktur



    }

}
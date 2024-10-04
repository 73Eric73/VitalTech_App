using HospitalAPI.Models;
using MySql.Data.EntityFramework;
using MySqlX.XDevAPI.Relational;
using System.Data.Entity;

namespace HospitalApi.Data
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public partial class ApplicationDbContext : DbContext
    {
        static ApplicationDbContext()
        {
            DbConfiguration.SetConfiguration(new MySqlEFConfiguration());
            Database.SetInitializer<ApplicationDbContext>(null);
        }
        
        public ApplicationDbContext() : base("ApplicationDbContext")
        {
        }

        public DbSet<Consulta> Consultes { get; set; }
        public DbSet<EpisodiMedic> EpisodisMedics { get; set; }
        public DbSet<Habitacio> Habitacions { get; set; }
        public DbSet<Ingres> Ingressos { get; set; }
        public DbSet<Llit> Llits { get; set; }
        public DbSet<Personal> Personals { get; set; }
        public DbSet<Pacient> Pacients { get; set; }
        public DbSet<Planta> Plantes { get; set; }
        public DbSet<User> Users { get; set; }
         protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Habitacio>()
            .HasOne(h => h.Planta)
            .WithMany(p => p.Habitacions)
            .HasForeignKey(h => h.PlantaId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Llit>()
            .HasOne(l => l.Habitacio)
            .WithMany(h => h.Llits)
            .HasForeignKey(l => l.HabitacioId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ingres>()
            .HasOne(h => h.EpisodiMedic)
            .WithMany(p => p.Ingressos)
            .HasForeignKey(h => h.EpisodiMedicId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ingres>()
           .HasOne(h => h.Llit)
           .WithMany(p => p.Ingressos)
           .HasForeignKey(h => h.LlitId)
           .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EpisodiMedic>()
            .HasOne(h => h.Pacient)
            .WithMany(p => p.EpisodisMedics)
            .HasForeignKey(h => h.PacientId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Consulta>()
            .HasOne(c => c.EpisodiMedic)
            .WithMany(p => p.Consultes)
            .HasForeignKey(c => c.EpisodiMedicId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Consulta>()
            .HasOne(c => c.Personal)
            .WithMany(p => p.Consultes)
            .HasForeignKey(c => c.PersonalId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Habitacio>()
            .HasIndex(e => e.CodiHabitacio)
            .IsUnique();

            modelBuilder.Entity<Llit>()
            .HasIndex(e => e.CodiLlit)
            .IsUnique();

            modelBuilder.Entity<Pacient>()
            .HasIndex(e => e.DNI)
            .IsUnique();

            modelBuilder.Entity<Personal>()
            .HasIndex(e => e.DNI)
            .IsUnique();

            modelBuilder.Entity<Pacient>()
            .HasIndex(e => e.NumSS)
            .IsUnique();

            base.OnModelCreating(modelBuilder);

        }
    }
}

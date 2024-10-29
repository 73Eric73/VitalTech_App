﻿using HospitalAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<PruebasDiagnosticas> PruebasDiagnosticas { get; set; }
        public DbSet<EpisodiMedic> EpisodisMedics { get; set; }
        public DbSet<Habitacio> Habitacions { get; set; }
        public DbSet<Ingres> Ingressos { get; set; }
        public DbSet<Llit> Llits { get; set; }
        public DbSet<Usuari> Usuari { get; set; }
        public DbSet<Pacient> Pacients { get; set; }
        public DbSet<Planta> Plantes { get; set; }
        public DbSet<Rol> Rol { get; set; }
        public DbSet<Permis> Permisos { get; set; }
        public DbSet<Entiat> Entiatas { get; set; }
        public DbSet<RolPermisEntitat> RolPermisEntitats { get; set; }
        public DbSet<Administratiu> Administratius { get; set; }
        public DbSet<Enfermer> Enfermer { get; set; }
        public DbSet<SuperUsuari> SuperUsuaris { get; set; }
        public DbSet<Metge> Metges { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
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

            modelBuilder.Entity<PruebasDiagnosticas>()
            .HasOne(c => c.EpisodiMedic)
            .WithMany(p => p.PruebasDiagnosticas)
            .HasForeignKey(c => c.EpisodiMedicId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PruebasDiagnosticas>()
            .HasOne(c => c.Usuari)
            .WithMany(p => p.PruebasDiagnosticas)
            .HasForeignKey(c => c.UsuariId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EpisodiMedic>()
            .HasOne(c => c.Usuari)
            .WithMany(p => p.EpisodisMedics)
            .HasForeignKey(c => c.UsuariId)
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

            modelBuilder.Entity<Metge>()
            .HasIndex(e => e.DNI)
            .IsUnique();

            modelBuilder.Entity<Administratiu>()
            .HasIndex(e => e.DNI)
            .IsUnique();

            modelBuilder.Entity<Enfermer>()
            .HasIndex(e => e.DNI)
            .IsUnique();

            modelBuilder.Entity<Pacient>()
            .HasIndex(e => e.NumSS)
            .IsUnique();

            modelBuilder.Entity<Planta>()
            .HasIndex(e => e.Piso)
            .IsUnique();

            base.OnModelCreating(modelBuilder);

        }
    }
}

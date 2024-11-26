﻿// <auto-generated />
using System;
using HospitalApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace HospitalApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241126082620_nuevas_migraciones")]
    partial class nuevas_migraciones
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("HospitalAPI.Models.Entitat", b =>
                {
                    b.Property<string>("Tablas")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Tablas");

                    b.ToTable("Entitats");
                });

            modelBuilder.Entity("HospitalAPI.Models.EpisodiMedic", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DataObertura")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataTancament")
                        .HasColumnType("datetime2");

                    b.Property<string>("Estat")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("MetgeId")
                        .HasColumnType("int");

                    b.Property<string>("Motivo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PacientId")
                        .HasColumnType("int");

                    b.Property<string>("Recepta")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Urgencia")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("MetgeId");

                    b.HasIndex("PacientId");

                    b.ToTable("EpisodisMedics");
                });

            modelBuilder.Entity("HospitalAPI.Models.Habitacio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CapacitatLlits")
                        .HasColumnType("int");

                    b.Property<int>("CodiHabitacio")
                        .HasColumnType("int");

                    b.Property<int>("PlantaId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CodiHabitacio")
                        .IsUnique();

                    b.HasIndex("PlantaId");

                    b.ToTable("Habitacions");
                });

            modelBuilder.Entity("HospitalAPI.Models.Ingres", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DataEntrada")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataSortida")
                        .HasColumnType("datetime2");

                    b.Property<int>("EpisodiMedicId")
                        .HasColumnType("int");

                    b.Property<int>("LlitId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("EpisodiMedicId");

                    b.HasIndex("LlitId");

                    b.ToTable("Ingressos");
                });

            modelBuilder.Entity("HospitalAPI.Models.Llit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CodiLlit")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("ForaDeServei")
                        .HasColumnType("bit");

                    b.Property<int>("HabitacioId")
                        .HasColumnType("int");

                    b.Property<bool>("Ocupat")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("CodiLlit")
                        .IsUnique();

                    b.HasIndex("HabitacioId");

                    b.ToTable("Llits");
                });

            modelBuilder.Entity("HospitalAPI.Models.Pacient", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AdministratiuId")
                        .HasColumnType("int");

                    b.Property<DateTime>("BirthDay")
                        .HasColumnType("datetime2");

                    b.Property<string>("Cognom1")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Cognom2")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DNI")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Estado")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Nacionalidad")
                        .HasColumnType("int");

                    b.Property<string>("Nom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NumSS")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Sexe")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Telefono")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AdministratiuId");

                    b.HasIndex("DNI")
                        .IsUnique();

                    b.HasIndex("NumSS")
                        .IsUnique();

                    b.ToTable("Pacients");
                });

            modelBuilder.Entity("HospitalAPI.Models.Permis", b =>
                {
                    b.Property<string>("Accio")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Accio");

                    b.ToTable("Permisos");
                });

            modelBuilder.Entity("HospitalAPI.Models.Personal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("DNI")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Nom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Telefon")
                        .HasColumnType("int");

                    b.Property<string>("UsuariId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DNI")
                        .IsUnique();

                    b.ToTable("Personal");

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("HospitalAPI.Models.Planta", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CapacitatHabitacions")
                        .HasColumnType("int");

                    b.Property<int>("Piso")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("Piso")
                        .IsUnique();

                    b.ToTable("Plantes");
                });

            modelBuilder.Entity("HospitalAPI.Models.PruebasDiagnosticas", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool?>("Correcta")
                        .HasColumnType("bit");

                    b.Property<string>("Dolencia")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EnfermerId")
                        .HasColumnType("int");

                    b.Property<int>("EpisodiMedicId")
                        .HasColumnType("int");

                    b.Property<int>("MetgeId")
                        .HasColumnType("int");

                    b.Property<string>("Pruebas")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Resultados")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("EnfermerId");

                    b.HasIndex("EpisodiMedicId");

                    b.HasIndex("MetgeId");

                    b.ToTable("PruebasDiagnosticas");
                });

            modelBuilder.Entity("HospitalAPI.Models.Rol", b =>
                {
                    b.Property<string>("Nom")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Descripcio")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Nom");

                    b.ToTable("Rol");
                });

            modelBuilder.Entity("HospitalAPI.Models.RolPermisEntitat", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("EntitatId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("PermisId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RolId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("EntitatId");

                    b.HasIndex("PermisId");

                    b.HasIndex("RolId");

                    b.ToTable("RolPermisEntitats");
                });

            modelBuilder.Entity("HospitalAPI.Models.Usuari", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("PersonalId")
                        .HasColumnType("int");

                    b.Property<string>("RolId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("PersonalId")
                        .IsUnique()
                        .HasFilter("[PersonalId] IS NOT NULL");

                    b.HasIndex("RolId");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Usuari");
                });

            modelBuilder.Entity("HospitalAPI.Models.AdministradorSistema", b =>
                {
                    b.HasBaseType("HospitalAPI.Models.Personal");

                    b.Property<string>("Prioridad")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("AdministradorSistema", (string)null);
                });

            modelBuilder.Entity("HospitalAPI.Models.Administratiu", b =>
                {
                    b.HasBaseType("HospitalAPI.Models.Personal");

                    b.Property<string>("Area")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("Administratiu", (string)null);
                });

            modelBuilder.Entity("HospitalAPI.Models.Enfermer", b =>
                {
                    b.HasBaseType("HospitalAPI.Models.Personal");

                    b.Property<string>("Especialitat")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("Enfermers", (string)null);
                });

            modelBuilder.Entity("HospitalAPI.Models.Metge", b =>
                {
                    b.HasBaseType("HospitalAPI.Models.Personal");

                    b.Property<string>("Especialitat")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("Metges", (string)null);
                });

            modelBuilder.Entity("HospitalAPI.Models.EpisodiMedic", b =>
                {
                    b.HasOne("HospitalAPI.Models.Metge", "Metge")
                        .WithMany("EpisodiMedics")
                        .HasForeignKey("MetgeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.Pacient", "Pacient")
                        .WithMany("EpisodisMedics")
                        .HasForeignKey("PacientId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Metge");

                    b.Navigation("Pacient");
                });

            modelBuilder.Entity("HospitalAPI.Models.Habitacio", b =>
                {
                    b.HasOne("HospitalAPI.Models.Planta", "Planta")
                        .WithMany("Habitacions")
                        .HasForeignKey("PlantaId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Planta");
                });

            modelBuilder.Entity("HospitalAPI.Models.Ingres", b =>
                {
                    b.HasOne("HospitalAPI.Models.EpisodiMedic", "EpisodiMedic")
                        .WithMany("Ingressos")
                        .HasForeignKey("EpisodiMedicId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.Llit", "Llit")
                        .WithMany("Ingressos")
                        .HasForeignKey("LlitId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("EpisodiMedic");

                    b.Navigation("Llit");
                });

            modelBuilder.Entity("HospitalAPI.Models.Llit", b =>
                {
                    b.HasOne("HospitalAPI.Models.Habitacio", "Habitacio")
                        .WithMany("Llits")
                        .HasForeignKey("HabitacioId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Habitacio");
                });

            modelBuilder.Entity("HospitalAPI.Models.Pacient", b =>
                {
                    b.HasOne("HospitalAPI.Models.Administratiu", "Administratiu")
                        .WithMany()
                        .HasForeignKey("AdministratiuId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Administratiu");
                });

            modelBuilder.Entity("HospitalAPI.Models.PruebasDiagnosticas", b =>
                {
                    b.HasOne("HospitalAPI.Models.Enfermer", "Enfermer")
                        .WithMany("PruebasDiagnosticas")
                        .HasForeignKey("EnfermerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.EpisodiMedic", "EpisodiMedic")
                        .WithMany("PruebasDiagnosticas")
                        .HasForeignKey("EpisodiMedicId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.Metge", "Metge")
                        .WithMany("PruebasDiagnosticas")
                        .HasForeignKey("MetgeId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Enfermer");

                    b.Navigation("EpisodiMedic");

                    b.Navigation("Metge");
                });

            modelBuilder.Entity("HospitalAPI.Models.RolPermisEntitat", b =>
                {
                    b.HasOne("HospitalAPI.Models.Entitat", "Entitat")
                        .WithMany()
                        .HasForeignKey("EntitatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.Permis", "Permis")
                        .WithMany()
                        .HasForeignKey("PermisId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("HospitalAPI.Models.Rol", "Rol")
                        .WithMany()
                        .HasForeignKey("RolId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Entitat");

                    b.Navigation("Permis");

                    b.Navigation("Rol");
                });

            modelBuilder.Entity("HospitalAPI.Models.Usuari", b =>
                {
                    b.HasOne("HospitalAPI.Models.Personal", "Personal")
                        .WithOne("Usuari")
                        .HasForeignKey("HospitalAPI.Models.Usuari", "PersonalId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("HospitalAPI.Models.Rol", "Rol")
                        .WithMany("Usuarios")
                        .HasForeignKey("RolId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Personal");

                    b.Navigation("Rol");
                });

            modelBuilder.Entity("HospitalAPI.Models.AdministradorSistema", b =>
                {
                    b.HasOne("HospitalAPI.Models.Personal", null)
                        .WithOne()
                        .HasForeignKey("HospitalAPI.Models.AdministradorSistema", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HospitalAPI.Models.Administratiu", b =>
                {
                    b.HasOne("HospitalAPI.Models.Personal", null)
                        .WithOne()
                        .HasForeignKey("HospitalAPI.Models.Administratiu", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HospitalAPI.Models.Enfermer", b =>
                {
                    b.HasOne("HospitalAPI.Models.Personal", null)
                        .WithOne()
                        .HasForeignKey("HospitalAPI.Models.Enfermer", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HospitalAPI.Models.Metge", b =>
                {
                    b.HasOne("HospitalAPI.Models.Personal", null)
                        .WithOne()
                        .HasForeignKey("HospitalAPI.Models.Metge", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HospitalAPI.Models.EpisodiMedic", b =>
                {
                    b.Navigation("Ingressos");

                    b.Navigation("PruebasDiagnosticas");
                });

            modelBuilder.Entity("HospitalAPI.Models.Habitacio", b =>
                {
                    b.Navigation("Llits");
                });

            modelBuilder.Entity("HospitalAPI.Models.Llit", b =>
                {
                    b.Navigation("Ingressos");
                });

            modelBuilder.Entity("HospitalAPI.Models.Pacient", b =>
                {
                    b.Navigation("EpisodisMedics");
                });

            modelBuilder.Entity("HospitalAPI.Models.Personal", b =>
                {
                    b.Navigation("Usuari");
                });

            modelBuilder.Entity("HospitalAPI.Models.Planta", b =>
                {
                    b.Navigation("Habitacions");
                });

            modelBuilder.Entity("HospitalAPI.Models.Rol", b =>
                {
                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("HospitalAPI.Models.Enfermer", b =>
                {
                    b.Navigation("PruebasDiagnosticas");
                });

            modelBuilder.Entity("HospitalAPI.Models.Metge", b =>
                {
                    b.Navigation("EpisodiMedics");

                    b.Navigation("PruebasDiagnosticas");
                });
#pragma warning restore 612, 618
        }
    }
}
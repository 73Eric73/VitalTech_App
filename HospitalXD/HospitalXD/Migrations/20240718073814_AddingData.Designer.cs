﻿// <auto-generated />
using HospitalXD.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace HospitalXD.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240718073814_AddingData")]
    partial class AddingData
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("HospitalXD.Models.Habitacio", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Capacitat")
                        .HasColumnType("int");

                    b.Property<int>("Num_llits")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Habitacions");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Capacitat = 4,
                            Num_llits = 0
                        },
                        new
                        {
                            Id = 2,
                            Capacitat = 5,
                            Num_llits = 0
                        });
                });
#pragma warning restore 612, 618
        }
    }
}

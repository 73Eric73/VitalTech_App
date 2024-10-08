﻿using AutoMapper;
using HospitalApi.DTO;
using HospitalAPI.Models;

namespace HospitalAPI
{
    public class MapConfig : Profile
    {

        public MapConfig()
        {
            CreateMap<Consulta, ConsultaCreateDTO>().ReverseMap();
            CreateMap<Consulta, ConsultaReadDTO>().ReverseMap();
            CreateMap<Consulta, ConsultaReferenceDTO>().ReverseMap();

            CreateMap<Habitacio, HabitacioReadDTO>().ReverseMap();
            CreateMap<Habitacio, HabitacionReferenceDTO>().ReverseMap();
            CreateMap<Habitacio, HabitacioCreateDTO>().ReverseMap();

            CreateMap<Llit, LlitReadDTO>().ReverseMap();
            CreateMap<Llit, LlitReferenceDTO>().ReverseMap();
            CreateMap<Llit, LlitCreateDTO>().ReverseMap();
            CreateMap<Llit, LlitUpdateDTO>().ReverseMap();

            CreateMap<Planta, PlantaReadDTO>().ReverseMap();
            CreateMap<Planta, PlantaCreateDTO>().ReverseMap();
            CreateMap<Planta, PlantaUpdateDTO>().ReverseMap();

            CreateMap<EpisodiMedic, EpisodiMedicReadDTO>().ReverseMap();
            CreateMap<EpisodiMedic, EpisodiMedicCreateDTO>().ReverseMap();
            CreateMap<EpisodiMedic, EpisodiMedicUpdateDTO>().ReverseMap();
            CreateMap<EpisodiMedic, EpisodiMedicReferenceDTO>().ReverseMap();

            CreateMap<Ingres, IngresReadDTO>().ReverseMap();
            CreateMap<Ingres, IngresCreateDTO>().ReverseMap();
            CreateMap<Ingres, IngresReferenceDTO>().ReverseMap();

            CreateMap<Pacient, PacientReadDTO>().ReverseMap();
            CreateMap<Pacient, PacientCreateDTO>().ReverseMap();

            CreateMap<Personal, PersonalReadDTO>().ReverseMap();
            CreateMap<Personal, PersonalCreateDTO>().ReverseMap();

        }

    }
}

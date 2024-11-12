using AutoMapper;
using HospitalApi.Data;
using HospitalApi.DTO;
using HospitalAPI.Models;
//using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantaController : ControllerBase
    {
        private readonly ILogger<PlantaController> _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;

        public PlantaController(
            ILogger<PlantaController> logger,
            ApplicationDbContext bbdd,
            IMapper mapper
        )
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PlantaReadDTO>>> GetPlantes()
        {
            _logger.LogInformation("Obtenint les habitacions");
            IEnumerable<Planta> plantaList = await _bbdd
                .Plantes.Include("Habitacions")
                .ToListAsync();
            return Ok(_mapper.Map<IEnumerable<PlantaReadDTO>>(plantaList));
        }

        [HttpGet("{id:int}", Name = "GetPlanta")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PlantaReadDTO>> GetPlanta(int id)
        {
            
            if (id <= 0)
            {
                _logger.LogError("Error, no existeix la planta amb l'ID indicat.");
                return BadRequest("Error, no existeix la planta amb l'ID indicat.");
            }

            var planta = await _bbdd.Plantes.Include("Habitacions").FirstOrDefaultAsync(p => p.Piso == id);
            if (planta == null) return NotFound();

            return Ok(_mapper.Map<PlantaReadDTO>(planta));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PlantaCreateDTO>> PostPlanta(
            [FromBody] PlantaCreateDTO userPlantaDTO
        )
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError("Error: dades introduïdes incorrectes.");
                return BadRequest("Error: dades introduïdes incorrectes.");
            }

            var plantaz = await _bbdd.Plantes.FirstOrDefaultAsync(p => p.Piso == userPlantaDTO.Piso);

            if(plantaz!=null){
                return BadRequest("Error: el piso introducido ya existe.");
            }

            Planta planta = _mapper.Map<Planta>(userPlantaDTO);

            await _bbdd.Plantes.AddAsync(planta);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Planta creada satisfactòriament.");
            return Ok(planta);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePlanta(int id)
        {
            //comentado para que se pueda borrar habitaciones accidentalmente creadas con id(piso) <= 0; si no, no deja
            // if (id <= 0)
            // {
            //     _logger.LogError("Error: format d'ID introduït incorrecte.");
            //     return BadRequest("Error: format d'ID introduït incorrecte.");
            // }

            var planta = await _bbdd.Plantes.FirstOrDefaultAsync(p => p.Piso == id);
            var habis = await _bbdd.Habitacions.Where(h => h.PlantaId == id).ToListAsync();

            if (planta == null)
            {
                _logger.LogError("Error: no existeix cap planta amb aquest ID.");
                return NotFound("Error: no existeix cap planta amb aquest ID.");
            }

            if (habis.Any())
            {
                _logger.LogError("Error: no es pot esborrar una planta que conté habitacions.");
                return BadRequest("Error: no es pot esborrar una planta que conté habitacions.");
            }

            _bbdd.Plantes.Remove(planta);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Planta esborrada satisfactòriament.");
            return NoContent();
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePlanta(int id, [FromBody] PlantaUpdateDTO userPlantaDTO)
        {
            if (userPlantaDTO == null || id <= 0)
            {
                _logger.LogError("Error: planta no trobada o dades introduïdes incorrectes.");
                return BadRequest("Error: planta no trobada o dades introduïdes incorrectes.");
            }

            var planta = await (from p in _bbdd.Plantes where p.Piso == id select p).FirstOrDefaultAsync();

            if (planta == null){
                _logger.LogError("No existeix una planta amb aquest ID.");
                return NotFound("No existeix una planta amb aquest ID.");
            }


            _mapper.Map(userPlantaDTO, planta);

            _bbdd.Plantes.Update(planta);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Planta modificada exitosament.");
            return NoContent();
        }

        
    }
}

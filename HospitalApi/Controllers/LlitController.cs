using AutoMapper;
using HospitalApi.Data;
using HospitalAPI.Models;
//using EntityFrameworkCore.MySQL.Data;
using HospitalApi.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace HospitalAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class LlitController : ControllerBase
    {

        private readonly ILogger<LlitController> _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;

        public LlitController(ILogger<LlitController> logger, ApplicationDbContext bbdd, IMapper mapper)
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<LlitReadDTO>>> GetLlits()
        {
            _logger.LogInformation("Obtenint els llits.");
            IEnumerable<Llit> llitList = await _bbdd.Llits.Include("Habitacio").Include("Ingressos").ToListAsync();
            IEnumerable<LlitReadDTO> llits = _mapper.Map<IEnumerable<LlitReadDTO>>(llitList);

            for (int i = 0; i < llits.Count(); i++)
            {
                var codi = await (from h in _bbdd.Habitacions where h.Id == llitList.ElementAt(i).HabitacioId select h.CodiHabitacio).FirstOrDefaultAsync();
                llits.ElementAt(i).CodiHabitacio = codi;
            }

            return Ok(llits);
        }


        [HttpGet("{id}", Name = "GetLlit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<LlitReadDTO>> GetLlit(string id)
        {

            if (id.Length < 4)
            {
                _logger.LogError("Error: dades introduïdes amb format incorrecte.");
                return BadRequest("Error: dades introduïdes amb format incorrecte.");
            }

            var llit = await _bbdd.Llits
            .Include(l => l.Habitacio)
            .Include(l => l.Ingressos).FirstOrDefaultAsync(h => h.CodiLlit == id);

            if (llit == null)
            {
                _logger.LogError("Error: no existeix el llit amb l'ID indicat.");
                return NotFound("Error: no existeix el llit amb l'ID indicat.");
            }
            var llitReadDTO = _mapper.Map<LlitReadDTO>(llit);
            if(llit.Habitacio != null){
                llitReadDTO.CodiHabitacio = llit.Habitacio.CodiHabitacio;
            }
            return Ok(llitReadDTO);

        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LlitCreateDTO>> PostLlit([FromBody] LlitCreateDTO userLlitDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (userLlitDTO.CodiLlit.Length < 4)
            {
                _logger.LogError("Error: dades introduïdes amb format incorrecte.");
                return BadRequest("Error: dades introduïdes amb format incorrecte.");
            }

            if (userLlitDTO == null)
            {
                _logger.LogError("Error: dades introduïdes incorrectes.");
                return BadRequest(userLlitDTO);
            }

            var habitacio = await _bbdd.Habitacions
            .Include(h => h.Llits)
            .FirstOrDefaultAsync(h => h.CodiHabitacio == userLlitDTO.CodiHabitacio);

            if (habitacio == null)
            {
                _logger.LogError("Error: no existeix l'habitacio amb l'ID indicat.");
                return BadRequest("Error: no existeix l'habitacio amb l'ID indicat");
            }

            if (habitacio.Llits == null) habitacio.Llits = new List<Llit>();
            

            if (habitacio.Llits.Count >= habitacio.CapacitatLlits)
            {
                _logger.LogError("No es poden afegir més llits a aquesta habitació.");
                return BadRequest("No es poden afegir més llits a aquesta habitació.");
            }

            Llit llit = _mapper.Map<Llit>(userLlitDTO);
            llit.HabitacioId = habitacio.Id;

            await _bbdd.Llits.AddAsync(llit);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Llit creat exitosament.");
            return Ok(llit);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteLlit(string id)
        {

            var llit = await _bbdd.Llits.FirstOrDefaultAsync(h => h.CodiLlit == id);

            if (llit == null)
            {
                _logger.LogError("Error: no existeix el llit amb l'ID indicat.");
                return NotFound("Error: no existeix el llit amb l'ID indicat.");
            }

            _bbdd.Llits.Remove(llit);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Llit esborrat exitosament.");
            return NoContent();

        }

        [HttpPut("{codi}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateLlit(string codi, [FromBody] LlitUpdateDTO userLlitDTO)
        {

            if (userLlitDTO == null || codi.Length != 4)
            {
                _logger.LogError("Error: no existeix el llit amb l'ID indicat.");
                return NotFound("Error: no existeix el llit amb l'ID indicat.");
            }

            var llit = await (from l in _bbdd.Llits where l.CodiLlit == codi select l).FirstOrDefaultAsync();

            if (llit == null){
                _logger.LogError("No existeix llit amb aquest ID.");
                return NotFound("No existeix llit amb aquest ID.");
            }


            var habitacio = await _bbdd.Habitacions.FirstOrDefaultAsync(p=> p.CodiHabitacio == userLlitDTO.CodiHabitacio);
            if(habitacio==null)
            {
                _logger.LogError("No existeix una habitacio amb aquest codi");
                return NotFound("No existeix una habitacio amb aquest codi");
            }

            llit.HabitacioId = habitacio.Id;

            _mapper.Map(userLlitDTO, llit);

            _bbdd.Llits.Update(llit);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Llit modificat exitosament.");
            return NoContent();
        }

    }
}

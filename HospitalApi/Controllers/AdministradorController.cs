using AutoMapper;
using HospitalApi.Data;
using HospitalAPI.DTO;
using HospitalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradorController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;

        public AdministradorController(
            ILogger<AdministradorController> logger,
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
        public async Task<ActionResult<IEnumerable<AdministratiuReadDTO>>> GetAdministradors() {
            _logger.LogInformation("Obtenint els administradors");
            IEnumerable<Administratiu> adminList = await _bbdd.Administratius.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<AdministratiuReadDTO>>(adminList));
        }
        
        [HttpGet("{id}", Name = "GetAdministratiu")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<AdministratiuReadDTO>>> GetAdministratiu(string id) {
            var admin = await _bbdd.Administratius.FirstOrDefaultAsync(a => a.DNI == id);
            if (admin == null) {
                _logger.LogError("No existeix un Administratiu amb aquest id");
                return NotFound("No existeix un Administratiu amb aquest id");
            }

            return Ok(_mapper.Map<AdministratiuReadDTO>(admin));
        }

        // [HttpPost]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        // public async Task<ActionResult<AdministradorSistemaReadDTO>> PostAdministratiu([FromBody] AdministratiuReadDTO nouAdmin) {
        //     Administratiu administratiu = _mapper.Map<Administratiu>(nouAdmin);

        //     if (!ModelState.IsValid) {
        //         _logger.LogError("Els camps no són vàlids");
        //         return BadRequest("Els camps no són vàlids");
        //     }

        //     if (await _bbdd.Administratius.FirstOrDefaultAsync(a => a.DNI == nouAdmin.AdministratiuDni) != null) {
        //         _logger.LogError("Ja existeix un Administratiu amb aquest DNI");
        //         return BadRequest("Ja existeix un Administratiu amb aquest DNI");
        //     }

        //     if (await _bbdd.Usuari.FirstOrDefaultAsync(p => p.Id == nouAdmin.AdministratiuId) == null) {
        //         _logger.LogError("No existeix un Usuari amb aques ID");
        //         return BadRequest("No existeix un Usuari amb aques ID");
        //     }
            
        // }
    }
}

using AutoMapper;
using HospitalApi.Data;
using HospitalApi.DTO;
using HospitalAPI.DTO;
using HospitalAPI.Models;
//using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradorSistemaController: ControllerBase
    {
        private readonly ILogger<AdministradorSistemaController> _logger;
        private readonly ApplicationDbContext _bbdd;
        private readonly IMapper _mapper;
        public AdministradorSistemaController(ILogger<AdministradorSistemaController> logger,ApplicationDbContext bbdd,IMapper mapper)
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AdministradorSistemaReadDTO>>> GetAdministradorsSistema()
        {
            _logger.LogInformation("Obtenint els Administradors de Sistema");
            IEnumerable<AdministradorSistema> administradorsList = await _bbdd.AdministradorSistema.ToListAsync();

            return Ok(_mapper.Map<IEnumerable<AdministradorSistemaReadDTO>>(administradorsList));
        }

        [HttpGet("{id}", Name = "GetAdministradorSistema")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AdministradorSistemaReadDTO>> GetAdministradorSistema(string id)
        {
            //comprobamos que el administrador exista
            var administradorSistema = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(e => e.DNI == id);
            if(administradorSistema==null)
            {
                _logger.LogError("No existeix un Administrador del Sistema amb aquest DNI");
                return NotFound("No existeix un Administrador del Sistema amb aquest DNI");
            }


            return Ok(_mapper.Map<AdministradorSistemaReadDTO>(administradorSistema));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AdministradorSistemaCreateDTO>> PostAdministradorSistema([FromBody] AdministradorSistemaCreateDTO nouAministradorSistema)
        {
            AdministradorSistema administradorSistema = _mapper.Map<AdministradorSistema>(nouAministradorSistema);

            if(!ModelState.IsValid) //comprueba que los datos sean validos
            {
                _logger.LogError("Els camps no son vàlids");
                return BadRequest("Els camps no son vàlids");
            }
            
            var adminDuplicado = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(p => p.DNI == nouAministradorSistema.DNI);
            if(adminDuplicado != null) //comprueba que no este duplicado
            {
                _logger.LogError("Ja existeix un Administrador de sistema amb aquest DNI");
                return BadRequest("Ja existeix un Administrador de sistema amb aquest DNI");
            }
            
            var usuari = await _bbdd.Usuari.FirstOrDefaultAsync(p => p.Id == nouAministradorSistema.UsuariId); 
            if(usuari==null) //comprueba que exista el usuario
            {
                _logger.LogError("No existeix un Usuari amb aques ID");
                return BadRequest("No existeix un Usuari amb aques ID");
            }
            if(!usuari.RolId.Equals("Administrador del Sistema")) //comprueba que el usuario tenga como idRol administrador de sistema
            {
                _logger.LogError("Aquest usuari no pot ser Administrador del Sistema");
                return BadRequest("Aquest usuari no pot ser Administrador del Sistema");
            }
            if(!CheckDNI(administradorSistema.DNI))
            {
                _logger.LogError("El DNI no es valid");
                return BadRequest("El DNI no es valid");
            }
            var usuarioEnUso = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(p => p.UsuariId == nouAministradorSistema.UsuariId);
            if(usuarioEnUso != null)
            {
                _logger.LogError("Ja existeix un Administrador de Sistema amb aquest Usuari ID");
                return BadRequest("Ja existeix un Administrador de Sistema amb aquest Usuari ID");
            }

            await _bbdd.AdministradorSistema.AddAsync(administradorSistema);
            await _bbdd.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AdministradorSistemaReadDTO>> DeleteAdministradorSistema(string id)
        {
            var adminitradorDelSistema = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(p => p.DNI == id);
            if(adminitradorDelSistema==null)
            {
                _logger.LogError("No existeix un Administrador del Sistema amb aquest DNI");
                return NotFound("No existeix un Administrador del Sistema amb aquest DNI");
            }

            var usuario = await _bbdd.Usuari.FirstOrDefaultAsync(p => p.Id == adminitradorDelSistema.UsuariId);
            usuario.RolId = null;

            _bbdd.AdministradorSistema.Remove(adminitradorDelSistema);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Administrador del sistema eliminat correctament");
            return NoContent();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateAdministradorSistema(string id, [FromBody] AdministradorSistemaUpdateDTO administradorSistemaUpdateDTO)
        {
            if(!ModelState.IsValid) //comprueba que los datos sean validos
            {
                _logger.LogError("Els camps no son valids");
                return BadRequest("Els camps no son valids");
            }
            
            var admin = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(p => p.DNI == administradorSistemaUpdateDTO.DNI);
            if(admin==null)
            {
                _logger.LogError("No existeix un Administrador del Sistema amb aquest DNI");
                return NotFound("No existeix un Administrador del Sistema amb aquest DNI");
            }
            
            var usuari = await _bbdd.Usuari.FirstOrDefaultAsync(p => p.Id == administradorSistemaUpdateDTO.UsuariId); 
            if(usuari==null) //comprueba que exista el usuario
            {
                _logger.LogError("No existeix un Usuari amb aques ID");
                return BadRequest("No existeix un Usuari amb aques ID");
            }
            if(!usuari.RolId.Equals("Administrador del Sistema")) //comprueba que el usuario tenga como idRol administrador de sistema
            {
                _logger.LogError("Aquest usuari no pot ser Administrador del Sistema");
                return BadRequest("Aquest usuari no pot ser Administrador del Sistema");
            }
            if(!CheckDNI(administradorSistemaUpdateDTO.DNI))
            {
                _logger.LogError("El DNI no es valid");
                return BadRequest("El DNI no es valid");
            }
            var usuarioEnUso = await _bbdd.AdministradorSistema.FirstOrDefaultAsync(p => p.UsuariId == administradorSistemaUpdateDTO.UsuariId);
            if(usuarioEnUso != null && usuarioEnUso.UsuariId != administradorSistemaUpdateDTO.UsuariId )
            {
                _logger.LogError("Ja existeix un Administrador de Sistema amb aquest Usuari ID");
                return BadRequest("Ja existeix un Administrador de Sistema amb aquest Usuari ID");
            }

            _mapper.Map(administradorSistemaUpdateDTO,admin);
            _bbdd.AdministradorSistema.Update(admin);
            await _bbdd.SaveChangesAsync();

            _logger.LogInformation("Administrador del Sistema modificat exitosament.");
            return NoContent();
        }

        public static bool CheckDNI(string dni)
        {

            var lettersArray = "TRWAGMYFPDXBNJZSQVHLCKE".ToCharArray();

            if (dni.Length != 9) return false;

            int dniValue = 0;
            char dniLetter = char.Parse(dni.Substring(8));

            if (int.TryParse(dni.Substring(0, 8), out dniValue))
            {

                Dictionary<int, char> letterToNum = new Dictionary<int, char>(23);

                for (int i = 0; i < 23; i++)
                {
                    letterToNum.Add(i, lettersArray[i]);
                }

                dniValue = dniValue % 23;

                foreach (var item in letterToNum)
                {
                    if (item.Key == dniValue && item.Value == dniLetter) return true;
                }

            }

            return false;

        }
    }
}
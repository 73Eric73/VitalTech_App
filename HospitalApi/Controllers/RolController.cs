
using AutoMapper; //para el maper
using HospitalApi.Data; 
using HospitalApi.DTO; //DTO's
using HospitalAPI.Models; //Modelos
//using EntityFrameworkCore.MySQL.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HospitalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        //para hacer logs
        private readonly ILogger<RolController> _logger;
        //para tratar con la base de datos
        private readonly ApplicationDbContext _bbdd;
        //para mapear
        private readonly IMapper _mapper;
        
        //constructor
        public RolController(
            ILogger<RolController> logger,
            ApplicationDbContext bbdd,
            IMapper mapper
        )
        {
            _logger = logger;
            _bbdd = bbdd;
            _mapper = mapper;
        }

        //para hacer los HttpGet
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<RolReadDTO>>> GetRols()
        {
            //logging obtenint els rols
            _logger.LogInformation("Obtenint els rols");
            IEnumerable<Rol> rolList = await _bbdd //espera a la respues de GBD
                .Rol//.Include("Usuarios") //incluimos los usuarios
                .ToListAsync(); //los convertimos en una lista asincrona
            return Ok(_mapper.Map<IEnumerable<RolReadDTO>>(rolList)); //devolvemos un Ok junto al rolList mapeado

        }

        [HttpGet("{nom}", Name = "GetRol")] //indica que tiene que haber un id obligatorio de tipo int
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RolReadDTO>> GetRol(string nom)
        {
       
            var rol = await _bbdd.Rol.FirstOrDefaultAsync(r => r.Nom == nom);//coge el primer resultado que coincida con el id
            if(rol == null) return NotFound(); //si es null es que no hay un rol con ese id

            return Ok(_mapper.Map<RolReadDTO>(rol)); //devuelve un RolReadDTO
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RolCreateDTO>> PostRol(
            [FromBody] RolCreateDTO userRolDTO //instancia con los datos que hemos creado de Rol
        )
        {
            if(!ModelState.IsValid) //valida los validadores definidos en el modelo
            {
                _logger.LogError("Error: dades introudïdes incorrectes.");
                return BadRequest("Error: dades introudïdes incorrectes.");
            }

            Rol rol = _mapper.Map<Rol>(userRolDTO); //crea un objecto tipo Rol con los datos
            
            await _bbdd.Rol.AddAsync(rol); //lo añade a la base de datos
            await _bbdd.SaveChangesAsync(); //guarda los cambios

            _logger.LogInformation("Rol creado correctamente");
            return Ok(rol);
        }

        [HttpDelete("{nom}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteRol(string nom)
        {
            
            var rol = await _bbdd.Rol.FirstOrDefaultAsync(r => r.Nom == nom); //coge el primer rol con ese id
            if(rol==null) //verifica que exista ese rol
            {
                return NotFound("Error, no existe un rol con ese id"); 
            }
            _bbdd.Rol.Remove(rol); //lo quita de la base de datos
            await _bbdd.SaveChangesAsync(); //acutaliza la base de datos

            _logger.LogInformation("Rol eliminado correctamente");
            return NoContent();
        }

        [HttpPut("{nom}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRol(string nom, [FromBody] RolUpdateDTO userUpdateDto)
        {
            if(!ModelState.IsValid)   //comprueba que los datos introducidos sean correctos   
            {
                _logger.LogError("Los datos introducidos son incorrectos.");
                return BadRequest("Los datos introducidos son incorrectos.");
            }
            var rol = await (from r in _bbdd.Rol where r.Nom == nom select r).FirstOrDefaultAsync();
            if(rol==null)  //comprueba que el rol exista
            {
                _logger.LogError("No existe un rol con ese nombre");
                return NotFound("No existe un rol con ese nombre");
            }
            _mapper.Map(userUpdateDto,rol); //mapea el rol

            _bbdd.Rol.Update(rol); //le cambia el valor en la base de datos
            await _bbdd.SaveChangesAsync(); //actualiza la base de datos

            _logger.LogInformation("Rol modificado correctamente");
            return NoContent();
        }

    }
}

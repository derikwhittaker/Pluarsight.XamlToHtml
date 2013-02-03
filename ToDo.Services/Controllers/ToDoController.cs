using System.Collections.Generic;
using System.Web.Http;
using ToDo.Services.Repository;

namespace ToDo.Services.Controllers
{
    public class ToDoController : ApiController
    {
        private readonly IDataRepository _dataRepository;

        public ToDoController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        public IEnumerable<ToDo.Models.ToDo> Get()
        {
            return _dataRepository.ActiveItems();
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }


        [HttpDelete]
        public void Delete(int id)
        {
            _dataRepository.Delete(id);
        }
    }
}
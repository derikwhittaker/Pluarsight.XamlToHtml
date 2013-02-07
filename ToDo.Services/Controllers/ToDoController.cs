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

        // POST api/values
        public void Update(Models.ToDo toDo)
        {
            _dataRepository.Update(toDo);
        }


        [HttpDelete]
        public void Delete(int id)
        {
            _dataRepository.Delete(id);
        }
    }
}